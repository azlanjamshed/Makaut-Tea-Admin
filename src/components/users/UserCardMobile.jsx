import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { Eye, ShieldBan, ShieldCheck, UserX } from 'lucide-react';

const UserCardMobile = ({
  user,
  onView,
  onSuspend,
  onBan,
  onRestore,
}) => {
  const navigate = useNavigate();
  const id = user._id || user.id;
  const status = (user.status || 'active').toLowerCase();

  return (
    <Card className="space-y-3 p-4">
      {/* Top Header */}
      <div
        onClick={() => navigate(`/users/${id}`)}
        className="flex items-center justify-between gap-2 cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-[var(--color-primary)] shrink-0 group-hover:scale-105 transition-transform">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-900 group-hover:text-[var(--color-primary)] transition-colors block truncate">
              {user.name}
            </span>
            <span className="text-[11px] text-slate-400 truncate block">
              {user.email}
            </span>
          </div>
        </div>
        <StatusBadge status={user.status} />
      </div>

      {/* Department & Stats Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
          {user.department || 'General'}
        </span>
        <div className="flex items-center gap-3 tabular-nums font-medium text-slate-700">
          <span>📝 {user.rantsCount || user.stats?.rants || 0}</span>
          <span>💬 {user.commentsCount || user.stats?.comments || 0}</span>
          <span>🔥 {user.reactionsCount || user.stats?.reactions || 0}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/users/${id}`)}
          icon={Eye}
          className="flex-1"
        >
          View Profile
        </Button>

        {status === 'active' && user.role !== 'admin' && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onSuspend?.(user)}
              icon={UserX}
              className="text-amber-600 border-amber-200 hover:bg-amber-50"
              title="Suspend"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onBan?.(user)}
              icon={ShieldBan}
              className="text-rose-600 border-rose-200 hover:bg-rose-50"
              title="Ban"
            />
          </>
        )}

        {(status === 'suspended' || status === 'banned') && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onRestore?.(user)}
            icon={ShieldCheck}
            className="flex-1 text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
          >
            Restore
          </Button>
        )}
      </div>
    </Card>
  );
};

export default UserCardMobile;
