import React from 'react';

const Textarea = ({
  label,
  error,
  maxLength,
  value = '',
  className = '',
  containerClassName = '',
  rows = 3,
  ...props
}) => {
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-xs font-semibold tracking-wide text-slate-700 uppercase">
            {label}
          </label>
        )}
        {maxLength && (
          <span
            className={`text-xs ${
              currentLength >= maxLength ? 'text-rose-500 font-bold' : 'text-slate-400'
            }`}
          >
            {currentLength} / {maxLength}
          </span>
        )}
      </div>
      <textarea
        rows={rows}
        maxLength={maxLength}
        value={value}
        className={`w-full bg-white border border-[var(--border-color)] text-slate-900 placeholder:text-slate-400 text-sm rounded-xl p-3 transition-colors duration-150 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/30 resize-none ${
          error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
};

export default Textarea;
