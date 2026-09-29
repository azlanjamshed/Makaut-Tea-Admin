import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import { Trash2 } from 'lucide-react';

const DeleteRantModal = ({
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
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Delete Rant?
            </h3>
            <p className="text-xs text-slate-500">
              This will soft-delete the rant. It can be restored later if needed.
            </p>
          </div>
        </div>

        {rant && (
          <div className="p-3 rounded-xl bg-slate-50 border border-[var(--border-color)] text-xs text-slate-700 italic line-clamp-2">
            "{rant.text}"
          </div>
        )}

        <Textarea
          label="Reason for deletion (Optional)"
          placeholder="e.g. Violation of harassment policies..."
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
            variant="danger"
            size="md"
            isLoading={isLoading}
            className="flex-1 font-bold cursor-pointer"
          >
            Delete
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DeleteRantModal;
