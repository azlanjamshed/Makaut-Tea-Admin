import React from 'react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { Eye, CheckCircle2, ShieldAlert, ExternalLink } from 'lucide-react';
import { timeAgo } from '../../utils/helpers';

const ReportCardMobile = ({
  report,
  onView,
  onResolve,
  onInvestigate,
  onOpenTarget,
  onOpenReporter,
}) => {
  const targetId = report.targetId || report.post?._id || report.post || report.comment?._id || report.comment || report.reportedUser?._id || report.reportedUser;
  const status = (report.status || 'pending').toLowerCase();

  return (
    <Card className="space-y-3 p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenTarget?.(report);
            }}
            className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-900 hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            title="Open reported target"
          >
            <span className="inline-flex items-center gap-1 text-rose-600">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>#{String(targetId || '').substring(0, 8)}</span>
            </span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 uppercase font-mono font-bold">
            {report.targetType || 'post'}
          </span>
          {report.post?.isAnonymous && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold border border-purple-200">
              Anonymous
            </span>
          )}
        </div>
        <StatusBadge status={report.status} />
      </div>

      {/* Reason and Description */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-bold text-slate-900 uppercase">
            Reason: {report.reason}
          </span>
        </div>
        {(report.description || report.post?.text || report.comment?.text) && (
          <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
            "{report.description || report.post?.text || report.comment?.text}"
          </p>
        )}
        <div className="text-[10px] text-slate-400 pt-1">
          Reported by{' '}
          {report.reporter?._id || report.reporter?.id ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenReporter?.(report);
              }}
              className="font-bold text-slate-700 hover:text-[var(--color-primary)] underline decoration-dotted transition-colors cursor-pointer"
            >
              {report.reporter?.name || 'Student'}
            </button>
          ) : (
            <span className="font-bold text-slate-700">{report.reporter?.name || 'Student'}</span>
          )}{' '}
          · {timeAgo(report.createdAt)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onView?.(report)}
          icon={Eye}
          className="flex-1"
        >
          View
        </Button>

        {status === 'pending' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onInvestigate?.(report)}
            icon={ShieldAlert}
            className="flex-1 text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100"
          >
            Investigate
          </Button>
        )}

        {(status === 'pending' || status === 'investigating') && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onResolve?.(report)}
            icon={CheckCircle2}
            className="flex-1"
          >
            Resolve
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ReportCardMobile;
