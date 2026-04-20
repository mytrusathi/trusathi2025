import React from 'react';
import { ChevronDown, Globe, Users, Lock } from 'lucide-react';
import { PrivacyLevel } from '@/types/profile';

interface PrivacySelectorProps {
  value: PrivacyLevel;
  onChange: (value: PrivacyLevel) => void;
  label?: string;
}

export const PrivacySelector = ({ value, onChange, label }: PrivacySelectorProps) => {
  const iconMap = {
    public: <Globe size={14} className="text-emerald-500" />,
    connection: <Users size={14} className="text-amber-500" />,
    private: <Lock size={14} className="text-rose-500" />,
  };

  const titleMap = {
    public: "Visible to Everyone",
    connection: "Visible to Connections Only",
    private: "Only Me (Protected)"
  };

  const cycle = () => {
    const levels: PrivacyLevel[] = ['public', 'connection', 'private'];
    const nextIdx = (levels.indexOf(value) + 1) % levels.length;
    onChange(levels[nextIdx]);
  };

  return (
    <div className="flex flex-col items-end shrink-0">
      {label && <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">{label}</span>}
      <button
        type="button"
        title={titleMap[value]}
        onClick={cycle}
        className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-white hover:shadow-sm transition-all group"
      >
        {iconMap[value]}
      </button>
    </div>
  );
};

export const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-slate-800 font-bold text-lg mb-6 flex items-center gap-2">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">{icon}</div> 
            {title}
        </h3>
        {children}
    </div>
);

export const Input = ({
  label,
  className,
  icon,
  privacyValue,
  onPrivacyChange,
  ...props
}: {
  label: string
  className?: string
  icon?: React.ReactNode
  privacyValue?: PrivacyLevel
  onPrivacyChange?: (val: PrivacyLevel) => void
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className={className}>
    <div className="flex justify-between items-end mb-2 ml-1">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>
        {privacyValue && onPrivacyChange && (
            <PrivacySelector value={privacyValue} onChange={onPrivacyChange} label="Privacy" />
        )}
    </div>
    <div className="relative">
        <input 
          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300 text-slate-800 font-medium"
          {...props}
        />
        {icon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</div>}
    </div>
  </div>
);

export const Select = ({
  label,
  options,
  displayFormat,
  icon,
  placeholder,
  privacyValue,
  onPrivacyChange,
  ...props
}: {
  label: string
  options: string[]
  displayFormat?: (value: string) => string
  icon?: React.ReactNode
  placeholder?: string
  privacyValue?: PrivacyLevel
  onPrivacyChange?: (val: PrivacyLevel) => void
} & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="w-full">
    <div className="flex justify-between items-end mb-2 ml-1">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>
        {privacyValue && onPrivacyChange && (
            <PrivacySelector value={privacyValue} onChange={onPrivacyChange} label="Privacy" />
        )}
    </div>
    <div className="relative">
      <select 
        className="w-full p-3 pr-10 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800 font-medium appearance-none cursor-pointer hover:bg-slate-50"
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {displayFormat ? displayFormat(opt) : opt}
          </option>
        ))}
      </select>
      {icon && <div className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</div>}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
        <ChevronDown size={18} strokeWidth={2.5} />
      </div>
    </div>
  </div>
);
