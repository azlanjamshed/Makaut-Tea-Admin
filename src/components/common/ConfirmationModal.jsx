import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Info, AlertOctagon, CheckCircle2 } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'primary' | 'success'
  isLoading = false,
  children,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return (
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
            <AlertOctagon className="w-6 h-6" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      case 'success':
        return (
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[var(--color-primary)] flex items-center justify-center shrink-0 border border-indigo-200">
            <Info className="w-6 h-6" />
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center space-y-4">
        {getIcon()}

        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {message}
          </p>
        </div>

        {children && <div className="w-full text-left pt-2">{children}</div>}

        <div className="flex items-center gap-3 w-full pt-4 border-t border-[var(--border-color)]">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'warning' ? 'warning' : variant === 'danger' ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1 font-bold"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
