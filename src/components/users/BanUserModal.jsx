import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import { ShieldBan, AlertTriangle } from 'lucide-react';

const BanUserModal = ({
  isOpen,
  onClose,
  onConfirm,
  user,
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
            <ShieldBan className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Permanently Ban User
            </h3>
            <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>This action permanently restricts the user account.</span>
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
          label="Ban Reason (Required)"
          placeholder="State the permanent infraction (e.g. severe harassment, impersonation, hate speech)..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={300}
          rows={3}
          required
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
            disabled={!reason.trim()}
            className="flex-1 font-bold cursor-pointer"
          >
            Ban User
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BanUserModal;
