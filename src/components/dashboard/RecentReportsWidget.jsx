import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { timeAgo } from '../../utils/helpers';

const RecentReportsWidget = ({ reports = [], onSelectReport }) => {
  return (
    <Card className="flex flex-col justify-between h-full space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              Pending Reports
            </h3>
          </div>
          <span className="text-xs text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Action Needed
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs flex flex-col items-center gap-1.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-1" />
            <span className="font-semibold text-slate-800">No pending reports</span>
            <span className="text-[11px] text-slate-500">The platform feed is clean!</span>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {reports.slice(0, 5).map((report) => {
              const id = report._id || report.id;
              const targetDesc =
                report.targetType === 'post'
                  ? `Rant #${String(report.targetId || report.post || '').substring(0, 6)}`
                  : report.targetType === 'comment'
                  ? `Comment #${String(report.targetId || report.comment || '').substring(0, 6)}`
                  : `User #${String(report.targetId || report.reportedUser || '').substring(0, 6)}`;

              return (
                <div
                  key={id}
                  onClick={() => onSelectReport?.(report)}
                  className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3 group cursor-pointer"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-bold text-slate-800 uppercase tracking-wide">
                        {report.reason || 'Flagged'}
                      </span>
                      <span>·</span>
                      <span className="text-slate-500 font-mono">{targetDesc}</span>
                    </div>

                    <p className="text-xs text-slate-700 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
                      {report.description || 'Reported by campus user'}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>By {report.reporter?.name || 'Anonymous student'}</span>
                      <span>·</span>
                      <span>{timeAgo(report.createdAt)}</span>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    <StatusBadge status={report.status || 'pending'} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Link
        to="/reports"
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 border border-[var(--border-color)] hover:border-slate-300 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors group shadow-2xs"
      >
        <span>Open Moderation Queue</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </Card>
  );
};

export default RecentReportsWidget;
