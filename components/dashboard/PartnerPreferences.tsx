"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Heart, Save, SlidersHorizontal, Sparkles } from 'lucide-react';

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
    try {
      await setDoc(doc(db, 'partner_preferences', user.uid), {
        ...prefs,
        updatedAt: new Date().toISOString()
      });
      alert('Preferences saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="bg-indigo-900 p-8 md:p-12 rounded-[3.5rem] relative overflow-hidden shadow-2xl shadow-indigo-900/20">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10">
               <Sparkles size={14} className="text-amber-400" /> Match Engine Settings
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Partner Preferences</h2>
            <p className="text-indigo-200 font-medium max-w-sm">Define your ideal match. We use these filters to suggest better profiles for you.</p>
         </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-10">
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Age Range */}
            <div className="space-y-4">
               <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  Age Range
               </label>
               <div className="flex items-center gap-4">
                  <select 
                    value={prefs.ageMin} 
                    onChange={(e) => setPrefs({...prefs, ageMin: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                     {AGE_OPTIONS.map(a => <option key={`min-${a}`} value={a}>{a} Years</option>)}
                  </select>
                  <span className="text-slate-300 font-black">TO</span>
                  <select 
                    value={prefs.ageMax} 
                    onChange={(e) => setPrefs({...prefs, ageMax: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                     {AGE_OPTIONS.map(a => <option key={`max-${a}`} value={a}>{a} Years</option>)}
                  </select>
               </div>
            </div>

            {/* Marital Status */}
            <div className="space-y-4">
               <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Marital Status</label>
               <select 
                  value={prefs.maritalStatus} 
                  onChange={(e) => setPrefs({...prefs, maritalStatus: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none"
               >
                  {MARITAL_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
               </select>
            </div>

            {/* Community */}
            <div className="space-y-4">
               <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Community / Religion</label>
               <select 
                  value={prefs.community} 
                  onChange={(e) => setPrefs({...prefs, community: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none"
               >
                  {COMMUNITIES.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>

            {/* Education */}
            <div className="space-y-4">
               <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Education Level</label>
               <input 
                  type="text"
                  value={prefs.education}
                  onChange={(e) => setPrefs({...prefs, education: e.target.value})}
                  placeholder="e.g. Masters, PhD, Any"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none placeholder:text-slate-300"
               />
            </div>
         </div>

         <div className="pt-6 border-t border-slate-50">
            <button 
              type="submit"
              disabled={saving}
              className="w-full md:w-auto px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50"
            >
               {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
               Save My Preferences
            </button>
         </div>
      </form>
    </div>
  );
}
