import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { formatDate } from '../../utils/helpers';
import { Eye, ShieldBan, ShieldCheck, UserX } from 'lucide-react';

const UserTable = ({
  users = [],
  onView,
  onSuspend,
  onBan,
  onRestore,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-[var(--border-color)] bg-slate-50/80 text-slate-500 uppercase tracking-wider font-mono text-[10px]">
            <th className="py-3.5 px-4 font-bold">User</th>
            <th className="py-3.5 px-4 font-bold">Department</th>
            <th className="py-3.5 px-4 font-bold text-center">Status</th>
            <th className="py-3.5 px-4 font-bold text-center">Role</th>
            <th className="py-3.5 px-4 font-bold text-center">Rants</th>
            <th className="py-3.5 px-4 font-bold text-center">Comments</th>
            <th className="py-3.5 px-4 font-bold text-center">Reacts</th>
            <th className="py-3.5 px-4 font-bold">Joined</th>
            <th className="py-3.5 px-4 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {users.map((user) => {
            const id = user._id || user.id;
            const status = (user.status || 'active').toLowerCase();

            return (
              <tr
                key={id}
                onClick={() => navigate(`/users/${id}`)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                title="Click to view full user profile"
              >
                {/* User info: Avatar, Name, Email */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-[var(--color-primary)] shrink-0">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-[var(--color-primary)] block transition-colors">
                        {user.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Department */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                    {user.department || 'General'}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <StatusBadge status={user.status} />
                </td>

                {/* Role Badge */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                      user.role === 'admin'
                        ? 'bg-indigo-50 text-[var(--color-primary)] border border-indigo-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {user.role || 'user'}
                  </span>
                </td>

                {/* Activity Counts */}
                <td className="py-3.5 px-4 text-center tabular-nums text-slate-700 font-semibold">
                  {user.rantsCount || user.stats?.rants || 0}
                </td>

                <td className="py-3.5 px-4 text-center tabular-nums text-slate-700 font-semibold">
                  {user.commentsCount || user.stats?.comments || 0}
                </td>

                <td className="py-3.5 px-4 text-center tabular-nums text-slate-700 font-semibold">
                  {user.reactionsCount || user.stats?.reactions || 0}
                </td>

                {/* Date Joined */}
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px] font-mono">
                  {formatDate(user.createdAt)}
                </td>

                {/* Actions */}
                <td
                  className="py-3.5 px-4 text-right whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/users/${id}`)}
                      icon={Eye}
                      title="View Full Profile"
                    />

                    {status === 'active' && user.role !== 'admin' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSuspend?.(user)}
                          icon={UserX}
                          title="Suspend User"
                          className="text-amber-600 hover:bg-amber-50"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onBan?.(user)}
                          icon={ShieldBan}
                          title="Ban User"
                          className="text-rose-600 hover:bg-rose-50"
                        />
                      </>
                    )}

                    {(status === 'suspended' || status === 'banned') && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onRestore?.(user)}
                        icon={ShieldCheck}
                        className="text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
                        title="Restore User"
                      >
                        Restore
                      </Button>
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

export default UserTable;
