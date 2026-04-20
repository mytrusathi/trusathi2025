"use client";

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
// ShieldCheck yahan add kiya gaya hai
import { User, Users, Check, Loader2, TriangleAlert, Building2, Handshake, ArrowRight, ArrowLeft, Sparkles, Mail, Lock, UserCircle, ShieldCheck } from 'lucide-react';

const RegisterPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [role, setRole] = useState<'member' | 'group-admin'>('member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (role === 'group-admin' && !groupName.trim()) {
        throw new Error("Please provide your Community Name.");
      }

      // Normalize identifier
      let finalIdentifier = identifier.trim();
      let phoneNumber = null;
      let emailAccount = null;

      const isPhone = /^\d{10,15}$/.test(finalIdentifier.replace(/[+\-\s()]/g, ''));
      if (isPhone) {
        phoneNumber = finalIdentifier.replace(/[+\-\s()]/g, '');
        emailAccount = `mobile_${phoneNumber}@trusathi.com`;
      } else {
        emailAccount = finalIdentifier;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, emailAccount, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const isApproved = role === 'member';
      let generatedSlug = '';
      if (role === 'group-admin') {
        generatedSlug = groupName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: !isPhone ? emailAccount : null,
        phoneNumber: phoneNumber,
        displayName: name,
        groupName: role === 'group-admin' ? groupName : null,
        role: role,
        isApproved: isApproved,
        slug: role === 'group-admin' ? generatedSlug : null,
        createdAt: new Date().toISOString(),
      });

      if (role === 'group-admin') {
        router.push('/dashboard/group-admin?registered=success');
      } else {
        router.push('/register/success');
      }

    } catch (err: any) {
      let errorMessage = err.message || 'Registration failed.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "This Email or Mobile Number is already registered.";
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden font-sans">

      {/* Cinematic Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-muted shadow-2xl rounded-full blur-[150px] pointer-events-none" />

      {/* Floating Back Button */}
      <div className="absolute top-10 left-10 z-20">
        <Link
          href="/"
          className="group flex items-center gap-3 text-muted-foreground hover:text-primary transition-all px-5 py-2.5 bg-card rounded-full border border-border shadow-sm"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit to Home</span>
        </Link>
      </div>

      <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-1000 relative z-10 py-12">
        <div className="bg-card p-10 md:p-16 rounded-[4rem] border border-border shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)]">

          <div className="text-center mb-14">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/5 rounded-3xl border border-primary/10 mb-6 shadow-sm hover:scale-105 transition-transform cursor-pointer">
              <Handshake className="text-primary" size={36} strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
              Begin with <span className="text-primary italic">Trust.</span>
            </h2>
            <p className="text-muted-foreground font-medium text-base max-w-xs mx-auto">
              Join the most sincere community for meaningful connections.
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 text-rose-600 p-5 rounded-3xl mb-10 text-xs font-bold border border-rose-500/20 flex items-center gap-4">
              <TriangleAlert size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-12">

            <div className="space-y-4">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] px-2">Select Account Type</label>
              <div className="grid grid-cols-2 gap-6">
                <RoleButton
                  active={role === 'member'}
                  onClick={() => setRole('member')}
                  icon={<UserCircle size={24} />}
                  label="Member"
                  desc="Seeking Sathi"
                />
                <RoleButton
                  active={role === 'group-admin'}
                  onClick={() => setRole('group-admin')}
                  icon={<Users size={24} />}
                  label="Admin"
                  desc="Group Leader"
                />
              </div>
            </div>

            <div className="space-y-8">
              {role === 'group-admin' && (
                <div className="animate-in slide-in-from-top-4 duration-500">
                  <InputField
                    icon={<Building2 size={20} />}
                    label="Community Name"
                    placeholder="e.g. Hindu Khatri Community Circle"
                    value={groupName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroupName(e.target.value)}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField
                  icon={<User size={20} />}
                  label="Full Name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                />
                <InputField
                  icon={<Mail size={20} />}
                  label="Email or Mobile Number"
                  placeholder="name@email.com or 9876543210"
                  value={identifier}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
                  type="text"
                />
              </div>

              <InputField
                icon={<Lock size={20} />}
                label="Password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                type="password"
              />
            </div>

            <div className="bg-secondary p-6 rounded-[2rem] border border-border flex items-start gap-4 transition-all">
              <input
                type="checkbox" id="terms" required
                className="mt-1 w-5 h-5 bg-transparent border-border rounded accent-primary cursor-pointer transition-all"
              />
              <label htmlFor="terms" className="text-[11px] text-muted-foreground font-medium leading-relaxed cursor-pointer select-none">
                I agree to maintain <span className="text-foreground">absolute honesty</span> and follow the
                <Link href="/terms" className="text-primary hover:text-primary/80 ml-1 font-black underline decoration-primary/20 underline-offset-4">Community Charter</Link>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black py-6 rounded-[2rem] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-primary/20 transform active:scale-[0.98] uppercase tracking-[0.25em] text-xs"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Complete Registration <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-12 text-center">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Already a member?</span>
            <Link href="/login" className="text-primary hover:text-primary/80 transition-colors ml-3 text-xs font-black uppercase tracking-widest underline decoration-primary/20 underline-offset-8">
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 opacity-80">
          <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
            <ShieldCheck size={14} className="text-primary" /> End-to-End Privacy
          </div>
          <div className="h-4 w-px bg-border/50" />
          <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
            <Sparkles size={14} className="text-primary" /> Human Verified
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Types Fix for Reusable Components ---

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
}

function InputField({ label, icon, ...props }: InputFieldProps) {
  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] px-2">{label}</label>
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300">
          {icon}
        </div>
        <input
          {...props}
          className="w-full bg-secondary border border-border pl-16 pr-6 py-5 rounded-[2rem] outline-none text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground font-medium transition-all duration-300 hover:bg-secondary/80"
        />
      </div>
    </div>
  );
}

interface RoleButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  desc: string;
}

function RoleButton({ active, onClick, icon, label, desc }: RoleButtonProps) {
  return (
    <button
      type="button" onClick={onClick}
      className={`relative p-8 rounded-[3rem] border-2 flex flex-col items-center text-center gap-3 transition-all duration-500 ${active
        ? 'border-primary bg-primary/5 text-foreground shadow-xl shadow-primary/5'
        : 'border-border bg-secondary text-muted-foreground hover:border-primary/30 hover:bg-secondary/80'
        }`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-1 transition-all duration-500 ${active ? 'bg-primary text-white scale-110 rotate-3' : 'bg-muted text-muted-foreground'}`}>
        {icon}
      </div>
      <span className="text-xs font-black uppercase tracking-widest leading-none">{label}</span>
      <span className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-opacity ${active ? 'text-primary/70' : 'opacity-60'}`}>{desc}</span>

      {active && (
        <div className="absolute top-5 right-5 animate-in zoom-in duration-300">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
            <Check size={14} strokeWidth={4} />
          </div>
        </div>
      )}
    </button>
  );
}

export default RegisterPage;