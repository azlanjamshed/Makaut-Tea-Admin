import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import { RESOLVE_ACTIONS, SUSPENSION_DURATIONS } from '../../utils/constants';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

const ResolveReportModal = ({
  isOpen,
  onClose,
  onConfirm,
  report,
  isLoading = false,
}) => {
  const [selectedAction, setSelectedAction] = useState('dismiss');
  const [notes, setNotes] = useState('');
  const [durationDays, setDurationDays] = useState(7);

  useEffect(() => {
    if (isOpen) {
      setSelectedAction('dismiss');
      setNotes('');
      setDurationDays(7);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm?.({
      actionTaken: selectedAction,
      notes: notes.trim(),
      durationDays,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Resolve Report
            </h3>
            <p className="text-xs text-slate-500">
              Select what moderation action to take and save resolution notes
            </p>
          </div>
        </div>

        {report && (
          <div className="p-3 rounded-xl bg-slate-50 border border-[var(--border-color)] text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-bold uppercase text-[11px] text-slate-900">
                Reason: {report.reason}
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-semibold uppercase">
                {report.targetType} target
              </span>
            </div>
            {report.description && (
              <p className="text-slate-600 line-clamp-2">
                "{report.description}"
              </p>
            )}
          </div>
        )}

        {/* Action Taken Radio Options */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block">
            Action Taken
          </label>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {RESOLVE_ACTIONS.map((act) => {
              const isSelected = selectedAction === act.id;
              return (
                <label
                  key={act.id}
                  onClick={() => setSelectedAction(act.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/60 border-[var(--color-primary)] text-slate-900 ring-1 ring-indigo-200'
                      : 'bg-white border-[var(--border-color)] text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                        : 'border-slate-400 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold block">{act.label}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {act.desc}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Optional Duration if suspend user */}
        {selectedAction === 'suspend_user' && (
          <div className="space-y-1.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
            <span className="font-bold text-amber-800 block flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Suspension Duration</span>
            </span>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {SUSPENSION_DURATIONS.map((dur) => (
                <button
                  key={dur.value}
                  type="button"
                  onClick={() => setDurationDays(dur.value)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
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
        )}

        {/* Resolution Notes */}
        <Textarea
          label="Resolution Notes"
          placeholder="Details on why this action was executed or findings from the review..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
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
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="flex-1 font-bold cursor-pointer"
          >
            Resolve Report
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ResolveReportModal;
