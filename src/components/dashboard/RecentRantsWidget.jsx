import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import { FileText, ArrowRight } from 'lucide-react';
import { timeAgo, truncateText, getRantStatus } from '../../utils/helpers';

const RecentRantsWidget = ({ rants = [], onSelectRant }) => {
  return (
    <Card className="flex flex-col justify-between h-full space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--color-primary)]" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              Recent Rants
            </h3>
          </div>
          <span className="text-xs text-slate-500">Latest feed activity</span>
        </div>

        {rants.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No rants posted yet.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {rants.slice(0, 5).map((rant) => {
              const id = rant._id || rant.id;
              const author = rant.isAnonymous
                ? rant.user?.anonymousUsername || 'Anonymous'
                : rant.user?.name || 'Student';

              return (
                <div
                  key={id}
                  onClick={() => onSelectRant?.(rant)}
                  className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3 group cursor-pointer"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-800">
                        {author}
                      </span>
                      <span>·</span>
                      <span className="text-[var(--color-primary)] font-medium">
                        {rant.department || 'General'}
                      </span>
                      <span>·</span>
                      <span>{timeAgo(rant.createdAt)}</span>
                    </div>

                    <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed group-hover:text-[var(--color-primary)] transition-colors">
                      "{truncateText(rant.text, 90)}"
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-0.5">
                      <span>🔥 {rant.reactions?.total || rant.reactions?.length || rant.reactionCount || 0}</span>
                      <span>💬 {rant.commentsCount || 0}</span>
                      <span>👁 {rant.views || 0}</span>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    <StatusBadge status={getRantStatus(rant)} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Link
        to="/rants"
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 border border-[var(--border-color)] hover:border-slate-300 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors group shadow-2xs"
      >
        <span>Moderate All Rants</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </Card>
  );
};

export default RecentRantsWidget;
