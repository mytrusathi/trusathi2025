"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: Props) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to send reset email. Please check the address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center ${success ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'}`}>
            {success ? <CheckCircle2 size={32} /> : <Mail size={32} />}
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900">
            {success ? 'Reset Email Sent' : 'Forgot Password?'}
          </h2>
          
          <p className="text-slate-500 leading-relaxed">
            {success 
              ? `We've sent recovery instructions to ${email}. Check your inbox and spam folder.`
              : 'Enter your account email and we\'ll send you a link to reset your password securely.'}
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                placeholder="yours@example.com"
                required
              />
            </div>

            {error && (
              <div className="flex gap-2 text-rose-600 text-sm font-medium bg-rose-50 p-3 rounded-xl border border-rose-100">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-rose-200 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <button 
            onClick={onClose}
            className="mt-8 w-full bg-slate-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            Finished
          </button>
        )}
      </div>
    </div>
  );
}
