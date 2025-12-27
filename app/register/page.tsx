"use client";
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { User, Users, Check, Loader2, TriangleAlert } from 'lucide-react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'member' | 'group-admin'>('member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      // SECURITY FIX: 
      // Members are auto-approved. 
      // Group Admins must be approved by Super Admin before accessing data.
      const isApproved = role === 'member';

      // Create user document in Firestore with SELECTED ROLE
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: role,
        isApproved: isApproved, 
        createdAt: new Date().toISOString(),
      });

      // Redirect based on role
      if (role === 'group-admin') {
        router.push('/register/pending');
      } else {
        router.push('/dashboard/member');
      }
      
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Failed to register. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
          <p className="text-slate-500 mt-2">Join truSathi to manage profiles or find matches</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('member')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                role === 'member' 
                  ? 'border-rose-500 bg-rose-50 text-rose-700' 
                  : 'border-slate-200 hover:border-slate-300 text-slate-500'
              }`}
            >
              <User size={24} />
              <span className="text-sm font-semibold">Member</span>
              {role === 'member' && <div className="absolute top-2 right-2 text-rose-500"><Check size={16} /></div>}
            </button>

            <button
              type="button"
              onClick={() => setRole('group-admin')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                role === 'group-admin' 
                  ? 'border-rose-500 bg-rose-50 text-rose-700' 
                  : 'border-slate-200 hover:border-slate-300 text-slate-500'
              }`}
            >
              <Users size={24} />
              <span className="text-sm font-semibold">Group Admin</span>
              {role === 'group-admin' && <div className="absolute top-2 right-2 text-rose-500"><Check size={16} /></div>}
            </button>
          </div>
          
          {/* Warning Message for Admins */}
          {role === 'group-admin' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-lg flex gap-2">
              <TriangleAlert className="shrink-0" size={16} />
              <p>Note: Group Admin accounts require manual verification by the Trusathi team before you can access the dashboard.</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
              placeholder="e.g. Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {/* Terms and Conditions Checkbox */}
          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start gap-2 pt-2">
            <input 
              type="checkbox" 
              id="terms" 
              required 
              className="mt-1 w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer">
              I agree to the{' '}
              <Link href="/terms" target="_blank" className="text-rose-600 font-medium hover:underline">
                Terms and Conditions
              </Link>
              {' '}and{' '}
              <Link href="/privacy" target="_blank" className="text-rose-600 font-medium hover:underline">
                Privacy Policy
              </Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
          </button>
        </form>

         <p className="mt-6 text-center text-slate-600 text-sm">
          Already have an account? <Link href="/login" className="text-rose-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;