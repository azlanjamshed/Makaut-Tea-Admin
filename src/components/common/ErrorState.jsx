import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

const ErrorState = ({
  title = 'Something went wrong',
  message = 'Failed to load content from the server. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-rose-50/60 border border-rose-200 space-y-3 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h4 className="text-base font-bold text-slate-900 font-display">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            icon={RefreshCw}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
