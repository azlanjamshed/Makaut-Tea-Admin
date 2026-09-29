import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import { SUSPENSION_DURATIONS } from '../../utils/constants';
import { UserX } from 'lucide-react';

const SuspendUserModal = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  isLoading = false,
}) => {
  const [reason, setReason] = useState('');
  const [durationDays, setDurationDays] = useState(7);

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setDurationDays(7);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm?.({
      reason: reason.trim(),
      durationDays,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Suspend Student User
            </h3>
            <p className="text-xs text-slate-500">
              Temporarily restrict account from creating rants or comments
            </p>
          </div>
        </div>

        {user && (
          <div className="p-3 rounded-xl bg-slate-50 border border-[var(--border-color)] text-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div>
              <span className="font-bold text-slate-900 block">{user.name}</span>
              <span className="text-slate-500">{user.email}</span>
            </div>
          </div>
        )}

        <Textarea
          label="Suspension Reason (Required)"
          placeholder="State the reason for suspension (e.g. repeated spam, inappropriate comments)..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={300}
          rows={3}
          required
        />

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block">
            Suspension Duration
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SUSPENSION_DURATIONS.map((dur) => (
              <button
                key={dur.value}
                type="button"
                onClick={() => setDurationDays(dur.value)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                  durationDays === dur.value
                    ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-2xs'
                    : 'bg-white border-[var(--border-color)] text-slate-700 hover:border-slate-300'
                }`}
              >
                {dur.label}
              </button>
            ))}
          </div>
        </div>

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
            disabled={!reason.trim()}
            className="flex-1 font-bold cursor-pointer"
          >
            Suspend User
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SuspendUserModal;
