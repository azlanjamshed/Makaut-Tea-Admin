import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { AlertTriangle, User, Calendar, ShieldAlert, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

const ReportDetailModal = ({
  isOpen,
  onClose,
  report,
  onInvestigate,
  onResolve,
  onReject,
  onOpenTarget,
}) => {
  const navigate = useNavigate();
  if (!report) return null;

  const status = (report.status || 'pending').toLowerCase();
  const targetId = report.targetId || report.post?._id || report.post || report.comment?._id || report.comment || report.reportedUser?._id || report.reportedUser;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Investigation"
      subtitle={`Report ID: ${report._id || report.id}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Status & Priority Header */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Reason: {report.reason}
              </span>
              <span className="text-xs text-slate-500 block">
                Target Type: <strong className="text-[var(--color-primary)] uppercase font-mono font-bold">{report.targetType}</strong>
              </span>
            </div>
          </div>
          <StatusBadge status={report.status} />
        </div>

        {/* Reporter Card */}
        <div className="p-4 rounded-2xl bg-white border border-[var(--border-color)] shadow-2xs flex items-center justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
              Reported By
            </span>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-[var(--color-primary)] shrink-0">
                {report.reporter?.name?.charAt(0) || 'U'}
              </div>
              <div className="text-xs truncate">
                <span className="font-bold text-slate-900 block truncate">
                  {report.reporter?.name || 'Anonymous Student'}
                </span>
                <span className="text-slate-500 truncate block">
                  {report.reporter?.email || 'Student Email Hidden'}
                </span>
              </div>
            </div>
          </div>

          {(report.reporter?._id || report.reporter?.id) && (
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(`/users/${report.reporter._id || report.reporter.id}`);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[var(--color-primary)] font-bold text-xs transition-colors shrink-0 cursor-pointer"
              title="Open Reporter Profile"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Profile</span>
            </button>
          )}
        </div>

        {/* Target Information */}
        <div className="p-4 rounded-2xl bg-white border border-[var(--border-color)] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
              Reported Target ({report.targetType || 'post'})
            </span>
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
              #{String(targetId || '').substring(0, 8)}
            </span>
          </div>

          {/* Target Content Preview */}
          {report.post && typeof report.post === 'object' && (
            <div className="p-3 rounded-xl bg-slate-50 border border-[var(--border-color)] text-xs space-y-1">
              <span className="font-semibold text-slate-500 text-[10px] uppercase font-mono">
                Post Text Content:
              </span>
              <p className="text-slate-800 line-clamp-2 leading-relaxed">
                "{report.post.text || report.post.content || 'Post content'}"
              </p>
            </div>
          )}

          {report.reportedUser && typeof report.reportedUser === 'object' && (
            <div className="p-3 rounded-xl bg-slate-50 border border-[var(--border-color)] text-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-indigo-50 text-[var(--color-primary)] font-bold flex items-center justify-center text-xs">
                {report.reportedUser.name?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-900 block truncate">{report.reportedUser.name}</span>
                <span className="text-[10px] text-slate-400 block truncate">{report.reportedUser.email}</span>
              </div>
            </div>
          )}

          {report.comment && typeof report.comment === 'object' && (
            <div className="p-3 rounded-xl bg-slate-50 border border-[var(--border-color)] text-xs space-y-1">
              <span className="font-semibold text-slate-500 text-[10px] uppercase font-mono">
                Comment Content:
              </span>
              <p className="text-slate-800 line-clamp-2">
                "{report.comment.text || report.comment.content || 'Comment text'}"
              </p>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenTarget?.(report);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-xs transition-all shadow-2xs cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>
                {report.targetType === 'user' ? 'Open User Profile →' : 'Open Reported Content →'}
              </span>
            </button>
          </div>
        </div>

        {/* Report Description / Details */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Reporter's Complaint
          </label>
          <div className="p-4 rounded-2xl bg-slate-50 border border-[var(--border-color)] text-sm text-slate-800 leading-relaxed whitespace-pre-wrap select-text">
            {report.description || 'No additional comment provided by reporter.'}
          </div>
        </div>

        {/* Moderation Notes if any */}
        {report.notes && (
          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs space-y-1">
            <span className="font-bold text-[var(--color-primary)] uppercase tracking-wide text-[10px]">
              Admin Resolution Notes:
            </span>
            <p className="text-slate-700">{report.notes}</p>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-400 px-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Filed on {formatDateTime(report.createdAt)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-[var(--border-color)]">
          {status === 'pending' && (
            <Button
              variant="secondary"
              size="sm"
              icon={ShieldAlert}
              onClick={() => {
                onClose();
                onInvestigate?.(report);
              }}
              className="text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100"
            >
              Investigate
            </Button>
          )}

          {(status === 'pending' || status === 'investigating') && (
            <>
              <Button
                variant="primary"
                size="sm"
                icon={CheckCircle2}
                onClick={() => {
                  onClose();
                  onResolve?.(report);
                }}
              >
                Resolve Report
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={XCircle}
                onClick={() => {
                  onClose();
                  onReject?.(report);
                }}
                className="text-rose-600 hover:bg-rose-50"
              >
                Reject
              </Button>
            </>
          )}

          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportDetailModal;
