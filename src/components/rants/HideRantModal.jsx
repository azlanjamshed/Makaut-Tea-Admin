import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import { EyeOff } from 'lucide-react';

const HideRantModal = ({
  isOpen,
  onClose,
  onConfirm,
  rant,
  isLoading = false,
}) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) setReason('');
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm?.(reason.trim());
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Hide Rant
            </h3>
            <p className="text-xs text-slate-500">
              The rant will be removed from public campus feeds
            </p>
          </div>
        </div>

        {rant && (
          <div className="p-3 rounded-xl bg-slate-50 border border-[var(--border-color)] text-xs text-slate-700 italic line-clamp-2">
            "{rant.text}"
          </div>
        )}

        <Textarea
          label="Why are you hiding this rant? (Optional)"
          placeholder="e.g. Under investigation for campus code of conduct..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={300}
          rows={3}
        />

        <div className="flex items-center gap-3 pt-3 border-t border-[var(--border-color)]">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="warning"
            size="md"
            isLoading={isLoading}
            className="flex-1 font-bold cursor-pointer"
          >
            Hide Rant
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default HideRantModal;
