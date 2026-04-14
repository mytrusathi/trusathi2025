"use client";

import React, { useRef, useState } from 'react';
import {
  CheckCircle2, ArrowRight, UserCircle,
  Phone, Mail, Camera, MessageSquare, ShieldCheck,
  AlertCircle, Loader2, X,
} from 'lucide-react';
import { Profile } from '@/types/profile';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  confirmPhoneVerificationOtp,
  sendMemberEmailVerification,
  sendPhoneVerificationOtp,
  syncEmailVerifiedProfiles,
} from '@/app/lib/member-verification';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/app/lib/firebase';
import { 
  doc, updateDoc, collection, query, where, 
  limit, getDocs, getDoc, setDoc, addDoc 
} from 'firebase/firestore';
import imageCompression from 'browser-image-compression';

interface Step {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  isOptional?: boolean;
  href?: string;
  buttonText: string;
}

interface Props {
  profile: Profile | null;
  onProfileRefresh?: () => Promise<void> | void;
}

export default function AuthenticityChecklist({ profile, onProfileRefresh }: Props) {
  const { user, refreshUser } = useAuth();
  const [sendingEmail, setSendingEmail] = useState(false);
  const [refreshingEmail, setRefreshingEmail] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(profile?.contact || user?.phoneNumber || '');
  const [verificationId, setVerificationId] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [selfieLoading, setSelfieLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const coreFields: (keyof Profile)[] = [
    'name', 'gender', 'dob', 'city', 'religion', 'caste',
    'education', 'profession', 'income', 'fatherName',
    'imageUrl', 'about', 'contact',
  ];
  const filledCount = profile ? coreFields.filter((field) => !!profile[field]).length : 0;
  const isProfileComplete = filledCount >= coreFields.length;

  const steps: Step[] = [
    {
      id: 'profile',
      title: 'Complete Profile',
      desc: 'Fill in all details to help people find you.',
      icon: <UserCircle size={20} />,
      isCompleted: isProfileComplete,
      href: '/dashboard/member?view=my-profiles',
      buttonText: isProfileComplete ? 'View Details' : 'Edit Profile',
    },
    {
      id: 'phone',
      title: 'Confirm Phone Number',
      desc: 'Confirm your phone via OTP to prevent fraud.',
      icon: <Phone size={20} />,
      isCompleted: !!profile?.phoneVerified || !!user?.phoneNumber,
      buttonText: profile?.phoneVerified || user?.phoneNumber ? 'Confirmed' : 'Confirm Now',
    },
    {
      id: 'email',
      title: 'Authenticate Email',
      desc: 'Stay updated with important match alerts.',
      icon: <Mail size={20} />,
      isCompleted: !!profile?.emailVerified || !!user?.emailVerified,
      isOptional: true,
      buttonText: !!profile?.emailVerified || !!user?.emailVerified ? 'Authenticated' : 'Send Verification',
    },
    {
      id: 'selfie',
      title: 'Upload Live Selfie',
      desc: 'A live shot proves you are real.',
      icon: <Camera size={20} />,
      isCompleted: !!profile?.selfieUrl,
      buttonText: profile?.selfieUrl ? 'Retake Selfie' : 'Upload Selfie',
    },
    {
      id: 'admin',
      title: 'Submit for Review',
      desc: 'Final step for official community screening.',
      icon: <ShieldCheck size={20} />,
      isCompleted: !!profile?.adminApproved || !!profile?.screeningStatus,
      buttonText: profile?.adminApproved ? 'Verified' : (profile?.screeningStatus === 'pending' ? 'Submitted' : 'Submit to Team'),
    },
  ];

  const mandatorySteps = ['profile', 'phone', 'selfie'];
  const isMandatoryComplete = steps
    .filter(s => mandatorySteps.includes(s.id))
    .every(s => s.isCompleted);

  const handleSubmitToAdmin = async () => {
    if (!profile || !user) return;
    if (!isMandatoryComplete) {
      setError('Please complete Profile, Phone, and Selfie steps first.');
      return;
    }

    setSelfieLoading(true);
    setError(null);
    setFeedback(null);

    try {
      // 1. Create Screening Request (Dedicated Collection)
      // This avoids querying the restricted 'users' collection for the admin ID
      const requestRef = collection(db, 'screening_requests');
      await addDoc(requestRef, {
        uid: user.uid,
        userName: user.displayName || 'Member',
        profileId: profile.id,
        profileNo: profile.profileNo || 'Unknown',
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      // 2. Update Profile Status
      if (!profile.id) throw new Error('Invalid profile ID.');
      await updateDoc(doc(db, 'profiles', profile.id), {
        screeningStatus: 'pending',
        updatedAt: new Date().toISOString(),
      });

      await onProfileRefresh?.();
      setFeedback('Your profile has been submitted for screening. Please wait 24-48 hours.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to submit for screening.');
    } finally {
      setSelfieLoading(false);
    }
  };

  const completedCount = steps.filter((step) => step.isCompleted).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const runProfileRefresh = async () => {
    await refreshUser();
    await onProfileRefresh?.();
  };

  const handleEmailVerification = async () => {
    setSendingEmail(true);
    setError(null);
    setFeedback(null);

    try {
      await sendMemberEmailVerification();
      setFeedback('Verification email sent. Open your inbox, verify, then tap refresh.');
    } catch (err: unknown) {
      console.error(err);
      setError('Unable to send verification email right now.');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleEmailRefresh = async () => {
    setRefreshingEmail(true);
    setError(null);
    setFeedback(null);

    try {
      await runProfileRefresh();
      
      if (user?.emailVerified) {
        await syncEmailVerifiedProfiles(user.uid, true);
        await onProfileRefresh?.();
      }
      
      setFeedback(user?.emailVerified ? 'Email verified and synced successfully.' : 'Email status refreshed.');
    } catch (err) {
      console.error(err);
      setError('Unable to refresh email status right now.');
    } finally {
      setRefreshingEmail(false);
    }
  };

  const handleSendOtp = async () => {
    setPhoneLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const nextVerificationId = await sendPhoneVerificationOtp(phoneNumber);
      setVerificationId(nextVerificationId);
      setFeedback('OTP sent successfully. Enter the code to complete verification.');
    } catch (err: unknown) {
      console.error(err);
      setError('Unable to send OTP. Please check the phone number format and try again.');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setPhoneLoading(true);
    setError(null);
    setFeedback(null);

    try {
      await confirmPhoneVerificationOtp(verificationId, otpCode);

      if (profile?.id && phoneNumber && phoneNumber !== profile.contact) {
        await updateDoc(doc(db, 'profiles', profile.id), { contact: phoneNumber });
      }

      await runProfileRefresh();
      setPhoneModalOpen(false);
      setVerificationId('');
      setOtpCode('');
      setFeedback('Phone number verified successfully.');
    } catch (err: unknown) {
      console.error(err);
      setError('OTP verification failed. Please recheck the code and try again.');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleSelfieUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.id || !user) return;

    setSelfieLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.25,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      });
      const selfieRef = ref(storage, `selfies/${user.uid}/${Date.now()}_${compressed.name}`);
      const snapshot = await uploadBytes(selfieRef, compressed);
      const selfieUrl = await getDownloadURL(snapshot.ref);

      await updateDoc(doc(db, 'profiles', profile.id), {
        selfieUrl,
        updatedAt: new Date().toISOString(),
      });

      await onProfileRefresh?.();
      setFeedback('Selfie uploaded successfully.');
    } catch (err) {
      console.error(err);
      setError('Unable to upload selfie right now.');
    } finally {
      setSelfieLoading(false);
      event.target.value = '';
    }
  };

  const handleStepAction = async (stepId: string) => {
    if (stepId === 'phone') {
      setPhoneModalOpen(true);
      setError(null);
      setFeedback(null);
      return;
    }

    if (stepId === 'email') {
      if (user?.emailVerified) {
        await handleEmailRefresh();
      } else {
        await handleEmailVerification();
      }
      return;
    }

    if (stepId === 'selfie') {
      selfieInputRef.current?.click();
      return;
    }

    if (stepId === 'admin') {
      if (profile?.adminApproved) {
        window.location.href = '/dashboard/member?view=chats&chat=super-admin';
      } else {
        await handleSubmitToAdmin();
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-indigo-100/20 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-1000">
        <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
          <ShieldCheck className="absolute -top-4 -right-4 text-white/10" size={120} />
          <div className="relative z-10 space-y-2">
            <h3 className="text-xl font-black uppercase tracking-tight">Onboarding Checklist</h3>
            <p className="text-indigo-100 text-sm font-medium">Follow these steps to reach 100% Authenticity Score.</p>

            <div className="pt-4 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">
                <span>Progress</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {(feedback || error) && (
          <div className={`mx-6 mt-6 rounded-2xl border px-4 py-3 text-xs font-semibold ${
            error ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
          }`}>
            {error || feedback}
          </div>
        )}

        <div className="p-6 space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                step.isCompleted
                  ? 'bg-emerald-50/50 border-emerald-100'
                  : 'bg-slate-50 border-slate-50 hover:border-indigo-100'
              }`}
            >
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                step.isCompleted ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
              }`}>
                {step.isCompleted ? <CheckCircle2 size={20} /> : step.icon}
              </div>

              <div className="grow min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm font-bold truncate ${step.isCompleted ? 'text-emerald-900' : 'text-slate-800'}`}>
                    {step.title}
                  </h4>
                  {step.isOptional && (
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Optional</span>
                  )}
                </div>
                <p className={`text-xs truncate ${step.isCompleted ? 'text-emerald-700/60' : 'text-slate-500'}`}>
                  {step.desc}
                </p>
              </div>

              {step.href ? (
                <Link
                  href={step.href}
                  className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    step.isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-600 hover:text-white shadow-sm'
                  }`}
                >
                  {step.buttonText} <ArrowRight size={12} />
                </Link>
              ) : (
                <button
                  onClick={() => handleStepAction(step.id)}
                  disabled={
                    sendingEmail || refreshingEmail || phoneLoading || selfieLoading || 
                    (step.id === 'admin' && !isMandatoryComplete) ||
                    (step.id === 'admin' && (profile?.screeningStatus === 'pending' || !!profile?.adminApproved))
                  }
                  className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    step.isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : (step.id === 'admin' && !isMandatoryComplete)
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-500 hover:text-indigo-600'
                  } disabled:opacity-70`}
                >
                  {(step.id === 'email' && (sendingEmail || refreshingEmail)) || (step.id === 'phone' && phoneLoading) || (step.id === 'selfie' && selfieLoading) || (step.id === 'admin' && selfieLoading)
                    ? <Loader2 size={12} className="animate-spin" />
                    : null}
                  {step.id === 'admin' && !isMandatoryComplete && !step.isCompleted ? 'Locked' : step.buttonText}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 pt-0">
          {!user?.emailVerified && (
            <button
              onClick={handleEmailRefresh}
              disabled={refreshingEmail}
              className="mb-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-600 transition-all disabled:opacity-70"
            >
              {refreshingEmail ? <Loader2 size={14} className="animate-spin" /> : null}
              Refresh Email Status
            </button>
          )}

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
              <strong>Note:</strong> Admin approval may take 24-48 hours after you complete all steps. High Authenticity profiles get more trust from families.
            </p>
          </div>
        </div>
      </div>

      <input
        ref={selfieInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleSelfieUpload}
      />

      <div id="phone-recaptcha" />

      {phoneModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black text-slate-900">Verify Phone Number</h4>
                <p className="text-sm text-slate-500">Use OTP verification to increase your authenticity score.</p>
              </div>
              <button onClick={() => setPhoneModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Phone Number</label>
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-300"
                />
              </div>

              {verificationId && (
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">OTP Code</label>
                  <input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6 digit OTP"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-300"
                  />
                </div>
              )}

              <div className="flex gap-3">
                {!verificationId ? (
                  <button
                    onClick={handleSendOtp}
                    disabled={phoneLoading || !phoneNumber.trim()}
                    className="flex-1 rounded-2xl bg-indigo-600 text-white px-4 py-3 text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-70"
                  >
                    {phoneLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Send OTP'}
                  </button>
                ) : (
                  <button
                    onClick={handleVerifyOtp}
                    disabled={phoneLoading || !otpCode.trim()}
                    className="flex-1 rounded-2xl bg-emerald-600 text-white px-4 py-3 text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-70"
                  >
                    {phoneLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Verify OTP'}
                  </button>
                )}
                <button
                  onClick={() => setPhoneModalOpen(false)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
