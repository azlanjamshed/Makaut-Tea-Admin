import React from 'react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import RantActionMenu from './RantActionMenu';
import { Eye, Image, AlertTriangle, ShieldCheck } from 'lucide-react';
import { timeAgo, getRantStatus } from '../../utils/helpers';

const RantCardMobile = ({
  rant,
  onView,
  onHide,
  onUnhide,
  onDelete,
  onRestore,
}) => {
  const rantStatus = getRantStatus(rant);
  const isOfficial = Boolean(
    rant.isOfficial || rant.isAdminPost || rant.user?.role === 'admin'
  );
  const author = isOfficial
    ? (rant.user?.name || 'Head of Rant Affairs 📢')
    : rant.isAnonymous
    ? rant.user?.anonymousUsername || 'Anonymous'
    : rant.user?.name || 'Student';

  return (
    <Card className={`space-y-3 p-4 ${isOfficial ? 'border-purple-300 bg-purple-50/20' : ''}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-700">
          {isOfficial && <ShieldCheck className="w-4 h-4 text-[var(--color-primary)] shrink-0" />}
          <span className={`font-bold ${isOfficial ? 'text-[var(--color-primary)]' : 'text-slate-900'}`}>{author}</span>
          <span>·</span>
          <span className="text-[var(--color-primary)] font-medium">
            {rant.semester || rant.department || 'General'}
          </span>
          {isOfficial && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
              OFFICIAL
            </span>
          )}
        </div>
        <StatusBadge status={rantStatus} />
      </div>

      {/* Rant Text */}
      <div className="space-y-1">
        <p className="text-xs text-slate-800 line-clamp-3 leading-relaxed">
          "{rant.text}"
        </p>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-0.5">
          {rant.image && (
            <span className="inline-flex items-center gap-1 text-sky-400">
              <Image className="w-3 h-3" />
              <span>Photo</span>
            </span>
          )}
          {rant.reportsCount > 0 && (
            <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
              <AlertTriangle className="w-3 h-3" />
              <span>{rant.reportsCount} Reports</span>
            </span>
          )}
          <span>{timeAgo(rant.createdAt)}</span>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-[var(--border-color)]">
        <span>🔥 {rant.reactions?.length || rant.reactionCount || 0}</span>
        <span>💬 {rant.commentsCount || 0}</span>
        <span>👁 {rant.views || 0}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-color)]">
        {rantStatus === 'hidden' ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onUnhide?.(rant)}
            icon={Eye}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white font-semibold"
          >
            Unhide
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView?.(rant)}
            icon={Eye}
            className="flex-1"
          >
            View
          </Button>
        )}
        <div className="p-1 rounded-xl bg-slate-50 border border-[var(--border-color)]">
          <RantActionMenu
            rant={rant}
            onView={onView}
            onHide={onHide}
            onUnhide={onUnhide}
            onDelete={onDelete}
            onRestore={onRestore}
          />
        </div>
      </div>
    </Card>
  );
};

export default RantCardMobile;
