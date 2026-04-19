"use client";

import React, { useRef, useState, useMemo } from 'react';
import {
  CheckCircle2, ArrowRight, UserCircle,
  Phone, Mail, Camera, ShieldCheck,
  AlertCircle, Loader2, X,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useAuthenticity } from '@/hooks/useAuthenticity';
import {
  confirmPhoneVerificationOtp,
  sendMemberEmailVerification,
  sendPhoneVerificationOtp,
  syncEmailVerifiedProfiles,
} from '@/app/lib/member-verification';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/app/lib/firebase';
import { 
  doc, updateDoc, collection, 
  setDoc, addDoc 
} from 'firebase/firestore';
import imageCompression from 'browser-image-compression';

interface Props {
  profile: any | null;
  onProfileRefresh?: () => Promise<void> | void;
}

export default function AuthenticityChecklist({ profile, onProfileRefresh }: Props) {
  const { user, refreshUser } = useAuth();
  const { pillars, totalScore, isMandatoryComplete } = useAuthenticity(profile, user);
  
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

  // Map hook pillars to local display requirements
  const steps = useMemo(() => {
    return pillars.map(p => {
      let icon = p.id === 'profile' ? <UserCircle size={20}/> :
                 p.id === 'phone' ? <Phone size={20}/> :
                 p.id === 'email' ? <Mail size={20}/> :
                 p.id === 'selfie' ? <Camera size={20}/> : <ShieldCheck size={20}/>;
      
      let buttonText = p.isMet ? 'Completed' : 'Complete';
      if (p.id === 'profile') buttonText = p.isMet ? 'View Profile' : 'Edit Profile';
      if (p.id === 'phone') buttonText = p.isMet ? 'Confirmed' : 'Verify Now';
      if (p.id === 'email') buttonText = p.isMet ? 'Verified' : 'Verify Email';
      if (p.id === 'selfie') buttonText = p.isMet ? 'Retake Selfie' : 'Upload Selfie';
      if (p.id === 'admin') buttonText = profile?.adminApproved ? 'Verified' : (profile?.screeningStatus === 'pending' ? 'Submitted' : 'Submit Now');

      return {
        ...p,
        title: p.label,
        desc: p.hint,
        icon,
        buttonText,
        isCompleted: p.isMet,
        isOptional: p.id === 'email'
      };
    });
  }, [pillars, profile]);

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
      const requestRef = doc(db, 'screening_requests', user.uid);
      await setDoc(requestRef, {
        uid: user.uid,
        userName: user.displayName || 'Member',
        profileId: profile.id,
        profileNo: profile.profileNo || 'Unknown',
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      await updateDoc(doc(db, 'profiles', profile.id), {
        screeningStatus: 'pending',
        updatedAt: new Date().toISOString(),
      });

      await onProfileRefresh?.();
      setFeedback('Your profile has been submitted for screening. Review takes 24-48 hours.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to submit for screening.');
    } finally {
      setSelfieLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    setSendingEmail(true);
    setError(null);
    try {
      await sendMemberEmailVerification();
      setFeedback('Verification email sent. Please check your inbox.');
    } catch (err) {
      setError('Failed to send verification email.');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleEmailRefresh = async () => {
    setRefreshingEmail(true);
    try {
      await refreshUser();
      if (user?.emailVerified) {
        await syncEmailVerifiedProfiles(user.uid, true);
        await onProfileRefresh?.();
      }
      setFeedback(user?.emailVerified ? 'Email successfully verified!' : 'Email status refreshed.');
    } catch (err) {
      setError('Status refresh failed.');
    } finally {
      setRefreshingEmail(false);
    }
  };

  const handleSendOtp = async () => {
    setPhoneLoading(true);
    try {
      const nextId = await sendPhoneVerificationOtp(phoneNumber);
      setVerificationId(nextId);
      setFeedback('OTP sent.');
    } catch (err) {
      setError('OTP send failed.');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setPhoneLoading(true);
    try {
      await confirmPhoneVerificationOtp(verificationId, otpCode);
      if (profile?.id && phoneNumber && phoneNumber !== profile.contact) {
        await updateDoc(doc(db, 'profiles', profile.id), { contact: phoneNumber });
      }
      await refreshUser();
      await onProfileRefresh?.();
      setPhoneModalOpen(false);
      setFeedback('Phone verified!');
    } catch (err) {
      setError('OTP verification failed.');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleSelfieUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.id || !user) return;
    setSelfieLoading(true);
    try {
      const compressed = await imageCompression(file, { maxSizeMB: 0.25, maxWidthOrHeight: 1000 });
      const selfieRef = ref(storage, `selfies/${user.uid}/${Date.now()}_selfie.jpg`);
      const snapshot = await uploadBytes(selfieRef, compressed);
      const url = await getDownloadURL(snapshot.ref);
      await updateDoc(doc(db, 'profiles', profile.id), { selfieUrl: url, updatedAt: new Date().toISOString() });
      await onProfileRefresh?.();
      setFeedback('Selfie uploaded!');
    } catch (err) {
      setError('Selfie upload failed.');
    } finally {
      setSelfieLoading(false);
      event.target.value = '';
    }
  };

  const handleStepAction = async (stepId: string) => {
    if (stepId === 'phone') { setPhoneModalOpen(true); return; }
    if (stepId === 'email') { user?.emailVerified ? await handleEmailRefresh() : await handleEmailVerification(); return; }
    if (stepId === 'selfie') { selfieInputRef.current?.click(); return; }
    if (stepId === 'admin') { 
      if (profile?.adminApproved) { window.location.href = '/dashboard/member?view=chats&chat=super-admin'; }
      else { await handleSubmitToAdmin(); }
    }
  };

  return (
    <>
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-rose-100/30 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="bg-gradient-to-br from-rose-600 to-rose-700 p-8 text-white relative">
          <ShieldCheck className="absolute -top-4 -right-4 text-white/10" size={140} />
          <div className="relative z-10 space-y-3">
            <h3 className="text-2xl font-black uppercase tracking-tight">Onboarding Guide</h3>
            <p className="text-rose-100 font-medium text-sm">Become a 'Highly Authentic' member by completing these steps.</p>

            <div className="pt-6 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.25em] text-rose-200">
                <span>Verification Progress</span>
                <span>{totalScore}%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-white transition-all duration-1000 ease-out"
                  style={{ width: `${totalScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {(feedback || error) && (
          <div className={`mx-8 mt-8 rounded-2xl border px-5 py-4 text-xs font-bold leading-relaxed ${
            error ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
          }`}>
            {error || feedback}
          </div>
        )}

        <div className="p-8 space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`group flex items-center gap-5 p-5 rounded-3xl border transition-all duration-300 ${
                step.isCompleted
                  ? 'bg-emerald-50/20 border-emerald-50 shadow-sm'
                  : 'bg-slate-50 border-slate-50 hover:border-rose-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100'
              }`}
            >
              <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                step.isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-white text-slate-300 group-hover:bg-rose-50 group-hover:text-rose-500'
              }`}>
                {step.isCompleted ? <CheckCircle2 size={24} /> : step.icon}
              </div>

              <div className="grow min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className={`text-sm font-black uppercase tracking-tight truncate ${step.isCompleted ? 'text-emerald-900' : 'text-slate-800'}`}>
                    {step.title}
                  </h4>
                  {step.isOptional && (
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/50">Bonus</span>
                  )}
                </div>
                <p className={`text-[11px] font-medium leading-normal ${step.isCompleted ? 'text-emerald-700/60' : 'text-slate-400'}`}>
                  {step.desc}
                </p>
              </div>

              <div className="shrink-0">
                {step.id === 'profile' ? (
                  <Link
                    href="/dashboard/member?view=my-profiles"
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      step.isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-rose-600'
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
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      step.isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : (step.id === 'admin' && !isMandatoryComplete)
                          ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-400 hover:text-rose-600 shadow-sm'
                    } disabled:opacity-50`}
                  >
                    {((step.id === 'email' && (sendingEmail || refreshingEmail)) || (step.id === 'phone' && phoneLoading) || (step.id === 'selfie' && selfieLoading) || (step.id === 'admin' && selfieLoading))
                      ? <Loader2 size={12} className="animate-spin" />
                      : null}
                    {step.buttonText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 pt-0 space-y-4">
          <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
            <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5 shadow-sm" />
            <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
              <strong>Family Trust Notice:</strong> High authenticity scores attract 3x more interests. Your selfie and phone verification are encrypted and only used for internal trust screening.
            </p>
          </div>
        </div>
      </div>

      <input ref={selfieInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleSelfieUpload} />

      {phoneModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[3rem] border border-slate-100 shadow-2xl space-y-6 overflow-hidden">
            <div className="bg-slate-50 p-8 text-center space-y-2 border-b border-slate-100 relative">
               <button onClick={() => setPhoneModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-600 transition-colors">
                  <X size={20} />
               </button>
               <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Phone Sync</h4>
               <p className="text-xs text-slate-500 font-medium">Verification prevents community spam.</p>
            </div>

            <div className="p-8 pt-0 space-y-5">
              <div className="space-y-4">
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-400 focus:shadow-lg focus:shadow-rose-100 transition-all"
                />

                {verificationId && (
                  <input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="6 Digit OTP Code"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:bg-white animate-in zoom-in-95 duration-300"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2">
                {!verificationId ? (
                  <button
                    onClick={handleSendOtp}
                    disabled={phoneLoading || !phoneNumber.trim()}
                    className="w-full rounded-2xl bg-rose-600 text-white px-5 py-4 font-black uppercase tracking-widest text-[10px] hover:bg-rose-700 shadow-xl shadow-rose-200 transition-all disabled:opacity-50"
                  >
                    {phoneLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Request OTP Code'}
                  </button>
                ) : (
                  <button
                    onClick={handleVerifyOtp}
                    disabled={phoneLoading || !otpCode.trim()}
                    className="w-full rounded-2xl bg-emerald-600 text-white px-5 py-4 font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all"
                  >
                    {phoneLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Confirm Verification'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
