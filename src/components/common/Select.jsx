import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
  label,
  error,
  options = [],
  value,
  onChange,
  className = '',
  containerClassName = '',
  placeholder = 'Select option...',
  ...props
}) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-xs font-semibold tracking-wide text-slate-700 uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`w-full appearance-none bg-white border border-[var(--border-color)] text-slate-900 text-sm rounded-xl py-2.5 pl-3.5 pr-10 transition-colors duration-150 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/30 cursor-pointer ${
            error ? 'border-rose-500' : ''
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value ?? opt.id;
            const text = typeof opt === 'string' ? opt : opt.label ?? opt.name;
            return (
              <option key={val} value={val} className="bg-white text-slate-900 py-2">
                {text}
              </option>
            );
          })}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
};

export default Select;
