import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] select-none rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

  const variants = {
    primary:
      'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] shadow-xs font-semibold',
    secondary:
      'bg-white border border-[var(--border-color)] text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shadow-2xs font-semibold',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 shadow-xs font-semibold',
    warning:
      'bg-amber-600 text-white hover:bg-amber-700 shadow-xs font-semibold',
    ghost:
      'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold',
    outline:
      'border border-[var(--border-color)] text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-4 py-2 h-10 gap-2',
    lg: 'text-base px-5 py-2.5 h-11 gap-2.5 font-semibold',
    icon: 'p-2 h-9 w-9 justify-center rounded-xl',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
