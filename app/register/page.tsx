"use client";
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { User, Users, Check, Loader2, TriangleAlert, Building2, Heart, ArrowRight, ArrowLeft } from 'lucide-react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
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
        throw new Error("Please provide your Community/Group Name.");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      const isApproved = role === 'member';

      let generatedSlug = '';
      if (role === 'group-admin') {
        generatedSlug = groupName
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
      }

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: role,
        isApproved: isApproved, 
        slug: role === 'group-admin' ? generatedSlug : null,
        createdAt: new Date().toISOString(),
      });

      if (role === 'group-admin') {
        router.push('/pending-approval');
      } else {
        router.push('/register/success');
      }
      
    } catch (err: unknown) {
      console.error(err);
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else {
        setError(firebaseError.message || 'Registration failed.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-4 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="absolute top-8 left-8 z-10">
        <Link 
          href="/" 
          className="flex items-center gap-3 text-slate-400 hover:text-white font-bold transition-all px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md"
        >
          <ArrowLeft size={18} /> <span className="text-sm uppercase tracking-widest">Home</span>
        </Link>
      </div>

      <div className="w-full max-w-xl animate-in fade-in zoom-in duration-700 relative z-10">
        <div className="bg-white/5 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-3xl shadow-black/50">
          
          <div className="text-center mb-10 space-y-4">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-2xl border border-white/10 mb-2">
                <Heart fill="#F43F5E" className="text-rose-500" size={28} />
             </div>
             <div>
                <h2 className="text-4xl font-black text-white tracking-tight">Create Account</h2>
                <p className="text-slate-400 font-medium mt-2">Join TruSathi to serve or find your partner</p>
             </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 text-rose-400 p-4 rounded-2xl mb-8 text-sm font-bold border border-rose-500/20">
               {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-8">
            
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4">
               <RoleButton 
                  active={role === 'member'} 
                  onClick={() => setRole('member')} 
                  icon={<User size={20} />} 
                  label="Member" 
                  desc="Find profile"
               />
               <RoleButton 
                  active={role === 'group-admin'} 
                  onClick={() => setRole('group-admin')} 
                  icon={<Users size={20} />} 
                  label="Admin" 
                  desc="Manage group"
               />
            </div>

            {role === 'group-admin' && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl flex gap-3 animate-in slide-in-from-top-2 duration-300">
                <TriangleAlert className="text-indigo-400 shrink-0" size={18} />
                <p className="text-[11px] text-indigo-200 font-medium leading-relaxed">
                   Admin accounts are manually verified by our team for community safety before dashboard access is granted.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-6">
                  {role === 'group-admin' && (
                    <div className="animate-in slide-in-from-left duration-500">
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Community Group Name</label>
                      <div className="relative group">
                        <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors" size={20} />
                        <input
                          type="text"
                          className="w-full bg-white/5 border border-white/10 pl-16 pr-6 py-4.5 rounded-[2rem] outline-none text-white focus:ring-2 focus:ring-rose-500/20 placeholder:text-slate-700 font-medium"
                          placeholder="e.g. Agarwal Community"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 px-6 py-4.5 rounded-[2rem] outline-none text-white focus:ring-2 focus:ring-rose-500/20 placeholder:text-slate-700 font-medium"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
               </div>

               <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full bg-white/5 border border-white/10 px-6 py-4.5 rounded-[2rem] outline-none text-white focus:ring-2 focus:ring-rose-500/20 placeholder:text-slate-700 font-medium"
                      placeholder="name@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Create Password</label>
                    <input
                      type="password"
                      className="w-full bg-white/5 border border-white/10 px-6 py-4.5 rounded-[2rem] outline-none text-white focus:ring-2 focus:ring-rose-500/20 placeholder:text-slate-700 font-medium"
                      placeholder="Min. 6 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
               </div>
            </div>

            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex items-start gap-3">
              <input 
                type="checkbox" 
                id="terms" 
                required 
                className="mt-1 w-5 h-5 bg-transparent border-white/20 rounded focus:ring-rose-500"
              />
              <label htmlFor="terms" className="text-xs text-slate-400 font-medium leading-relaxed cursor-pointer">
                I agree to serve the community in an authentic way and accept the{' '}
                <Link href="/terms" className="text-white hover:underline underline-offset-4">Terms & Conditions</Link>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-5 px-8 rounded-[2rem] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl shadow-rose-900/40 transform active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Complete Registration <ArrowRight size={20} /></>}
            </button>
          </form>

           <p className="mt-10 text-center text-slate-500 text-sm font-bold">
            Joined already? <Link href="/login" className="text-white hover:text-rose-400 transition-colors ml-1">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

function RoleButton({ active, onClick, icon, label, desc }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, desc: string }) {
   return (
      <button
         type="button"
         onClick={onClick}
         className={`relative p-6 rounded-[2rem] border-2 flex flex-col items-center text-center gap-2 transition-all duration-300 ${
            active 
            ? 'border-rose-500 bg-rose-500/10 text-white' 
            : 'border-white/10 bg-white/5 text-slate-500 hover:border-white/20'
         }`}
      >
         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-1 ${active ? 'bg-rose-500 text-white' : 'bg-white/5 text-slate-600'}`}>
            {icon}
         </div>
         <span className="text-sm font-black uppercase tracking-widest leading-none">{label}</span>
         <span className={`text-[10px] font-bold uppercase tracking-widest opacity-40 ${active ? 'text-rose-200' : ''}`}>{desc}</span>
         {active && (
            <div className="absolute top-4 right-4 text-rose-500">
               <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white scale-110 shadow-lg">
                  <Check size={12} strokeWidth={4} />
               </div>
            </div>
         )}
      </button>
   );
}

export default RegisterPage;