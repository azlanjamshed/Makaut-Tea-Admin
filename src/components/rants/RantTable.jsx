import React from 'react';
import StatusBadge from '../common/StatusBadge';
import RantActionMenu from './RantActionMenu';
import { formatDate, truncateText, getRantStatus } from '../../utils/helpers';
import { Image, AlertTriangle, ShieldCheck, Eye } from 'lucide-react';

const RantTable = ({
  rants = [],
  onView,
  onHide,
  onUnhide,
  onDelete,
  onRestore,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-[var(--border-color)] bg-slate-50 text-slate-600 uppercase tracking-wider font-mono text-[10px]">
            <th className="py-3 px-4 font-semibold">Rant Content</th>
            <th className="py-3 px-4 font-semibold">Author</th>
            <th className="py-3 px-4 font-semibold">Sem / Dept</th>
            <th className="py-3 px-4 font-semibold text-center">Reacts</th>
            <th className="py-3 px-4 font-semibold text-center">Comments</th>
            <th className="py-3 px-4 font-semibold text-center">Views</th>
            <th className="py-3 px-4 font-semibold text-center">Status</th>
            <th className="py-3 px-4 font-semibold">Date</th>
            <th className="py-3 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {rants.map((rant) => {
            const id = rant._id || rant.id;
            const rantStatus = getRantStatus(rant);
            const isOfficial = Boolean(
              rant.isOfficial || rant.isAdminPost || rant.user?.role === 'admin'
            );
            const author = isOfficial
              ? (rant.user?.name || 'Head of MAKAU-TEA Affairs 📢')
              : rant.isAnonymous
              ? rant.user?.anonymousUsername || 'Anonymous'
              : rant.user?.name || 'Student';

            return (
              <tr
                key={id}
                onClick={() => onView?.(rant)}
                className={`table-row-hover cursor-pointer transition-colors group ${
                  isOfficial ? 'bg-indigo-50/40' : ''
                }`}
              >
                {/* Rant Text Snippet + Media Badge */}
                <td className="py-3 px-4 max-w-xs">
                  <div className="flex items-center gap-2">
                    {isOfficial && (
                      <span className="p-1 rounded bg-indigo-50 text-[var(--color-primary)] border border-indigo-200 shrink-0" title="Official Announcement">
                        <ShieldCheck className="w-3 h-3" />
                      </span>
                    )}
                    {rant.image && (
                      <span className="p-1 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0" title="Has image attachment">
                        <Image className="w-3 h-3" />
                      </span>
                    )}
                    <span className="text-slate-800 group-hover:text-[var(--color-primary)] line-clamp-2 leading-relaxed transition-colors font-medium">
                      "{truncateText(rant.text, 90)}"
                    </span>
                  </div>
                  {rant.reportsCount > 0 && (
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-amber-600 font-bold">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>{rant.reportsCount} reports</span>
                    </span>
                  )}
                </td>

                {/* Author */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isOfficial ? 'text-[var(--color-primary)] font-bold' : 'text-slate-800'}`}>
                      {author}
                    </span>
                    {isOfficial ? (
                      <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200 font-mono font-bold">
                        ADMIN
                      </span>
                    ) : rant.isAnonymous ? (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                        ANON
                      </span>
                    ) : null}
                  </div>
                </td>

                {/* Semester / Department */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-50 border border-[var(--border-color)] text-slate-600 font-medium">
                    {rant.semester || rant.department || 'General'}
                  </span>
                </td>

                {/* Reactions */}
                <td className="py-3 px-4 text-center tabular-nums text-slate-700 font-semibold">
                  {rant.reactions?.total || rant.reactions?.length || rant.reactionCount || 0}
                </td>

                {/* Comments */}
                <td className="py-3 px-4 text-center tabular-nums text-slate-700 font-semibold">
                  {rant.commentsCount || 0}
                </td>

                {/* Views */}
                <td className="py-3 px-4 text-center tabular-nums text-slate-500 font-mono">
                  {rant.views || 0}
                </td>

                {/* Status Badge */}
                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <StatusBadge status={rantStatus} />
                </td>

                {/* Date */}
                <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-[11px] font-mono">
                  {formatDate(rant.createdAt)}
                </td>

                {/* Action Menu */}
                <td
                  className="py-3 px-4 text-right whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    {rantStatus === 'hidden' && (
                      <button
                        type="button"
                        onClick={() => onUnhide?.(rant)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold text-[11px] transition-all shadow-2xs"
                        title="Unhide and make visible to public"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Unhide</span>
                      </button>
                    )}
                    <RantActionMenu
                      rant={rant}
                      onView={onView}
                      onHide={onHide}
                      onUnhide={onUnhide}
                      onDelete={onDelete}
                      onRestore={onRestore}
                    />
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

export default RantTable;
