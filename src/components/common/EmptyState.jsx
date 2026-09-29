import React from 'react';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  emoji,
  title = 'No items found',
  message = 'There are no records matching your current filter criteria.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white border border-[var(--border-color)] shadow-2xs space-y-3 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-[var(--border-color)] flex items-center justify-center text-2xl shadow-2xs text-slate-400">
        {emoji ? (
          <span>{emoji}</span>
        ) : Icon ? (
          <Icon className="w-7 h-7 stroke-[1.75]" />
        ) : (
          <span>📭</span>
        )}
      </div>

      <div className="space-y-1 max-w-sm">
        <h4 className="text-base font-bold text-slate-900 font-display">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {message}
        </p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
