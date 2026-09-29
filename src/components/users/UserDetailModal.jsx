import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { User, Mail, Calendar, Building2, ShieldAlert, ShieldCheck, UserX, ShieldBan, FileText, MessageSquare, Flame, ExternalLink } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

const UserDetailModal = ({
  isOpen,
  onClose,
  user,
  stats,
  onSuspend,
  onBan,
  onRestore,
}) => {
  const navigate = useNavigate();
  if (!user) return null;

  const status = (user.status || 'active').toLowerCase();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Profile & Activity"
      subtitle={`User ID: ${user._id || user.id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* User Profile Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-[var(--border-color)] flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xl text-[var(--color-primary)] shadow-2xs shrink-0">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <span>{user.name?.charAt(0) || 'U'}</span>
            )}
          </div>

          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-base font-bold text-slate-900 font-display">
                {user.name}
              </h4>
              <div className="flex items-center gap-1.5 justify-center sm:justify-end">
                <StatusBadge status={user.status} />
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 text-slate-700 font-bold border border-slate-200">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.email}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>{user.department || 'General'}</span>
              </span>
            </div>

            {user.anonymousUsername && (
              <p className="text-[11px] text-[var(--color-primary)] font-mono font-bold pt-1">
                Public Anonymous Handle: @{user.anonymousUsername}
              </p>
            )}

            {user.bio && (
              <p className="text-xs text-slate-600 italic pt-1">
                "{user.bio}"
              </p>
            )}
          </div>
        </div>

        {/* Activity Metrics Bar */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-[var(--border-color)] shadow-2xs text-center">
            <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1 font-mono uppercase font-bold">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>Rants Posted</span>
            </span>
            <span className="text-xl font-black text-slate-900 font-display mt-1 block tabular-nums">
              {stats?.rants ?? user.rantsCount ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[var(--border-color)] shadow-2xs text-center">
            <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1 font-mono uppercase font-bold">
              <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
              <span>Comments</span>
            </span>
            <span className="text-xl font-black text-slate-900 font-display mt-1 block tabular-nums">
              {stats?.comments ?? user.commentsCount ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[var(--border-color)] shadow-2xs text-center">
            <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1 font-mono uppercase font-bold">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Reactions</span>
            </span>
            <span className="text-xl font-black text-slate-900 font-display mt-1 block tabular-nums">
              {stats?.reactions ?? user.reactionsCount ?? 0}
            </span>
          </div>
        </div>

        {/* Moderation Infractions Alert if Suspended or Banned */}
        {(status === 'suspended' || status === 'banned') && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-rose-700 font-bold uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Account Status Notice: {status}</span>
            </div>
            {user.suspensionReason && (
              <p className="text-slate-800">
                <strong>Infraction Reason:</strong> {user.suspensionReason}
              </p>
            )}
            {user.suspendedUntil && (
              <p className="text-slate-500">
                Active Until: {formatDateTime(user.suspendedUntil)}
              </p>
            )}
          </div>
        )}

        <div className="text-xs text-slate-400 flex items-center gap-1.5 px-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Member since {formatDateTime(user.createdAt)}</span>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-[var(--border-color)]">
          {status === 'active' && user.role !== 'admin' && (
            <>
              <Button
                variant="warning"
                size="sm"
                icon={UserX}
                onClick={() => {
                  onClose();
                  onSuspend?.(user);
                }}
              >
                Suspend Account
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={ShieldBan}
                onClick={() => {
                  onClose();
                  onBan?.(user);
                }}
              >
                Ban User
              </Button>
            </>
          )}

          {(status === 'suspended' || status === 'banned') && (
            <Button
              variant="primary"
              size="sm"
              icon={ShieldCheck}
              onClick={() => {
                onClose();
                onRestore?.(user);
              }}
            >
              Restore Access
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={ExternalLink}
            onClick={() => {
              onClose();
              navigate(`/users/${user._id || user.id}`);
            }}
          >
            Open Full Profile
          </Button>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailModal;
