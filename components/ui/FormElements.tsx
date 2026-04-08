import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-slate-800 font-bold text-lg mb-6 flex items-center gap-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">{icon}</div> 
            {title}
        </h3>
        {children}
    </div>
);

export const Input = ({
  label,
  className,
  icon,
  ...props
}: {
  label: string
  className?: string
  icon?: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className={className}>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">{label}</label>
    <div className="relative">
        <input 
          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all placeholder:text-slate-300 text-slate-800 font-medium"
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
  ...props
}: {
  label: string
  options: string[]
  displayFormat?: (value: string) => string
  icon?: React.ReactNode
  placeholder?: string
} & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">{label}</label>
    <div className="relative">
      <select 
        className="w-full p-3 pr-10 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-slate-800 font-medium appearance-none cursor-pointer hover:bg-slate-50"
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
