import React from 'react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { formatDate } from '../../utils/helpers';
import { Eye, ShieldAlert, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

const ReportTable = ({
  reports = [],
  onView,
  onResolve,
  onReject,
  onInvestigate,
  onOpenTarget,
  onOpenReporter,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-[var(--border-color)] bg-slate-50/80 text-slate-500 uppercase tracking-wider font-mono text-[10px]">
            <th className="py-3.5 px-4 font-bold">Report Target</th>
            <th className="py-3.5 px-4 font-bold">Type</th>
            <th className="py-3.5 px-4 font-bold">Reason</th>
            <th className="py-3.5 px-4 font-bold">Reporter</th>
            <th className="py-3.5 px-4 font-bold text-center">Status</th>
            <th className="py-3.5 px-4 font-bold">Reported Date</th>
            <th className="py-3.5 px-4 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {reports.map((report) => {
            const id = report._id || report.id;
            const targetId = report.targetId || report.post?._id || report.post || report.comment?._id || report.comment || report.reportedUser?._id || report.reportedUser;
            const targetDisplay = targetId ? `#${String(targetId).substring(0, 8)}` : 'Item';
            const status = (report.status || 'pending').toLowerCase();

            return (
              <tr
                key={id}
                onClick={() => onView?.(report)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                {/* Target Identification */}
                <td className="py-3.5 px-4 font-mono">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTarget?.(report);
                      }}
                      className="inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-[var(--color-primary)] transition-colors group/target cursor-pointer text-left"
                      title="Open reported target content"
                    >
                      <span>{targetDisplay}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover/target:text-[var(--color-primary)] transition-colors" />
                    </button>
                    {report.post?.isAnonymous && (
                      <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[9px] font-bold font-sans border border-purple-200">
                        Anonymous
                      </span>
                    )}
                  </div>
                  {/* Content Preview / Reason Description */}
                  {(report.description || report.post?.text || report.comment?.text) && (
                    <p className="text-[11px] text-slate-500 font-sans line-clamp-1 mt-0.5">
                      "{report.description || report.post?.text || report.comment?.text}"
                    </p>
                  )}
                  {report.post?.user && (
                    <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                      by <strong className="text-slate-600 font-medium">{report.post.user.name || 'Student'}</strong>
                      {report.post.isAnonymous && report.post.user.anonymousUsername ? ` (@${report.post.user.anonymousUsername})` : ''}
                    </span>
                  )}
                </td>

                {/* Target Type */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold uppercase text-[10px] font-mono">
                    {report.targetType || 'post'}
                  </span>
                </td>

                {/* Reason */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
                    {report.reason || 'General'}
                  </span>
                </td>

                {/* Reporter */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {report.reporter?._id || report.reporter?.id ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenReporter?.(report);
                      }}
                      className="text-left group/rep cursor-pointer block"
                      title="View reporter profile"
                    >
                      <span className="text-slate-800 font-medium group-hover/rep:text-[var(--color-primary)] transition-colors block">
                        {report.reporter?.name || 'Student'}
                      </span>
                      <span className="text-[10px] text-slate-400 group-hover/rep:text-[var(--color-primary)]/80 transition-colors block">
                        {report.reporter?.email || ''}
                      </span>
                    </button>
                  ) : (
                    <div>
                      <span className="text-slate-800 font-medium">
                        {report.reporter?.name || 'Student'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {report.reporter?.email || ''}
                      </span>
                    </div>
                  )}
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <StatusBadge status={report.status} />
                </td>

                {/* Date */}
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px] font-mono">
                  {formatDate(report.createdAt)}
                </td>

                {/* Inline Action Buttons */}
                <td
                  className="py-3.5 px-4 text-right whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView?.(report)}
                      icon={Eye}
                      title="View Details"
                    />

                    {status === 'pending' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onInvestigate?.(report)}
                        icon={ShieldAlert}
                        title="Mark Investigating"
                        className="text-amber-600 hover:text-amber-700 border-amber-200 bg-amber-50"
                      >
                        Investigate
                      </Button>
                    )}

                    {(status === 'pending' || status === 'investigating') && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onResolve?.(report)}
                          icon={CheckCircle2}
                          title="Resolve Report"
                        >
                          Resolve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onReject?.(report)}
                          icon={XCircle}
                          title="Reject Report"
                          className="text-slate-400 hover:text-rose-600"
                        />
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
