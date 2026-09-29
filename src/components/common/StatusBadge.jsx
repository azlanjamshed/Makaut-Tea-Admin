import React from 'react';

/**
 * Clean & Crisp Light Theme Status Badges:
 * - Active → Green
 * - Pending → Yellow / Amber
 * - Investigating → Blue
 * - Resolved → Green
 * - Rejected → Slate Gray
 * - Hidden → Orange
 * - Deleted → Red
 * - Suspended → Orange
 * - Banned → Red
 */
const STATUS_CONFIGS = {
  active: {
    label: 'Active',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  pending: {
    label: 'Pending',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  investigating: {
    label: 'Investigating',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  resolved: {
    label: 'Resolved',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  approved: {
    label: 'Broadcasted',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  },
  hidden: {
    label: 'Hidden',
    bg: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
  },
  deleted: {
    label: 'Deleted',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
  suspended: {
    label: 'Suspended',
    bg: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
  },
  banned: {
    label: 'Banned',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
  admin: {
    label: 'Admin',
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
  },
  user: {
    label: 'Student',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  },
};

const StatusBadge = ({ status, className = '', showDot = true }) => {
  const normalized = String(status || '').toLowerCase();
  const config = STATUS_CONFIGS[normalized] || {
    label: status ? String(status).toUpperCase() : 'UNKNOWN',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-mono uppercase tracking-wider border shadow-2xs ${config.bg} ${className}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
          aria-hidden="true"
        />
      )}
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
