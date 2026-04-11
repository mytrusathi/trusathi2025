"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Heart, Save, Sparkles, ChevronDown } from 'lucide-react';

interface Preferences {
  ageMin: string;
  ageMax: string;
  minHeight: string;
  maxHeight: string;
  community: string;
  education: string;
  maritalStatus: string;
}

const COMMUNITIES = ['Any', 'Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Other'];
const MARITAL_STATUS = ['Any', 'Never Married', 'Divorced', 'Widowed'];
const AGE_OPTIONS = Array.from({ length: 43 }, (_, i) => String(i + 18));

export default function PartnerPreferences() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [prefs, setPrefs] = useState<Preferences>({
    ageMin: '18',
    ageMax: '35',
    minHeight: 'Any',
    maxHeight: 'Any',
    community: 'Any',
    education: 'Any',
    maritalStatus: 'Any'
  });

  useEffect(() => {
    const fetchPrefs = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, 'partner_preferences', user.uid));
        if (snap.exists()) {
          setPrefs(snap.data() as Preferences);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setToast(null);
    try {
      await setDoc(doc(db, 'partner_preferences', user.uid), {
        ...prefs,
        updatedAt: new Date().toISOString()
      });
      setToast({ type: 'success', msg: 'Preferences saved successfully!' });
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', msg: 'Failed to save. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <Loader2 className="animate-spin text-indigo-600" size={48} />
      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Loading Strategy...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="bg-slate-900 p-10 md:p-16 rounded-[4rem] relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md border border-white/10">
               <Sparkles size={14} className="text-amber-400" /> Match Engine v2.0
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-xl">Partner Preferences</h2>
            <p className="text-slate-400 font-medium max-w-lg leading-relaxed text-lg">
               Define your ideal vision. Our matching engine uses these parameters to curate potential life partners that align with your journey.
            </p>
         </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-10 md:p-16 rounded-[4rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] space-y-14 relative group">
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {/* Age Range */}
            <div className="space-y-6">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Heart size={14} className="text-indigo-500" /> Desired Age Range
               </label>
               <div className="flex items-center gap-4">
                  <div className="relative flex-1 group">
                    <select 
                      value={prefs.ageMin} 
                      onChange={(e) => setPrefs({...prefs, ageMin: e.target.value})}
                      className="w-full p-5 bg-slate-50 border-2 border-transparent hover:border-indigo-100 rounded-3xl font-black text-slate-800 transition-all outline-none appearance-none"
                    >
                       {AGE_OPTIONS.map(a => <option key={`min-${a}`} value={a}>{a} Years</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-indigo-500" size={18} />
                  </div>
                  <span className="text-slate-300 font-black text-[10px]">TO</span>
                  <div className="relative flex-1 group">
                    <select 
                      value={prefs.ageMax} 
                      onChange={(e) => setPrefs({...prefs, ageMax: e.target.value})}
                      className="w-full p-5 bg-slate-50 border-2 border-transparent hover:border-indigo-100 rounded-3xl font-black text-slate-800 transition-all outline-none appearance-none"
                    >
                       {AGE_OPTIONS.map(a => <option key={`max-${a}`} value={a}>{a} Years</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-indigo-500" size={18} />
                  </div>
               </div>
            </div>

            {/* Marital Status */}
            <div className="space-y-6">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Relationship Status</label>
               <div className="relative group">
                 <select 
                    value={prefs.maritalStatus} 
                    onChange={(e) => setPrefs({...prefs, maritalStatus: e.target.value})}
                    className="w-full p-5 bg-slate-50 border-2 border-transparent hover:border-indigo-100 rounded-3xl font-black text-slate-800 transition-all outline-none appearance-none"
                 >
                    {MARITAL_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
                 <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-indigo-500" size={18} />
               </div>
            </div>

            {/* Community */}
            <div className="space-y-6">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Community / Belief System</label>
               <div className="relative group">
                 <select 
                    value={prefs.community} 
                    onChange={(e) => setPrefs({...prefs, community: e.target.value})}
                    className="w-full p-5 bg-slate-50 border-2 border-transparent hover:border-indigo-100 rounded-3xl font-black text-slate-800 transition-all outline-none appearance-none"
                 >
                    {COMMUNITIES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-indigo-500" size={18} />
               </div>
            </div>

            {/* Education */}
            <div className="space-y-6">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Education Requirement</label>
               <input 
                  type="text"
                  value={prefs.education}
                  onChange={(e) => setPrefs({...prefs, education: e.target.value})}
                  placeholder="e.g. Postgraduate, Any"
                  className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-200 focus:bg-white rounded-3xl font-black text-slate-800 transition-all outline-none placeholder:text-slate-300"
               />
            </div>
         </div>

         <div className="pt-8 border-t border-slate-100 space-y-4">
            {toast && (
              <div className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-semibold ${
                toast.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${toast.type === 'success' ? 'bg-green-500' : 'bg-rose-500'}`} />
                {toast.msg}
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">Changes take effect immediately.</p>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Preferences
              </button>
            </div>
         </div>
      </form>
    </div>
  );
}
