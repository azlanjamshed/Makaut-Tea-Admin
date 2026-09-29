import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import UserTable from '../components/users/UserTable';
import UserCardMobile from '../components/users/UserCardMobile';
import UserDetailModal from '../components/users/UserDetailModal';
import SuspendUserModal from '../components/users/SuspendUserModal';
import BanUserModal from '../components/users/BanUserModal';
import RestoreUserModal from '../components/users/RestoreUserModal';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { TableSkeleton } from '../components/common/Skeleton';
import { useToast } from '../context/ToastContext';
import * as usersApi from '../api/users';
import { USER_STATUSES, USER_ROLES } from '../utils/constants';
import { Search, RefreshCw, X } from 'lucide-react';

const UsersPage = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [role, setRole] = useState(searchParams.get('role') || 'all');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Modals & Target User
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [banTarget, setBanTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { showToast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
        status: status !== 'all' ? status : undefined,
        role: role !== 'all' ? role : undefined,
        search: search.trim() || undefined,
      };
      const res = await usersApi.getUsers(params);
      if (res.success) {
        setUsers(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, status, role]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleOpenDetail = async (user) => {
    setSelectedUser(user);
    try {
      const res = await usersApi.getUserById(user._id || user.id);
      if (res.success && res.stats) {
        setUserStats(res.stats);
      }
    } catch (err) {
      setUserStats(null);
    }
  };

  const handleSuspendConfirm = async ({ reason, durationDays }) => {
    if (!suspendTarget) return;
    setIsProcessing(true);
    try {
      await usersApi.suspendUser(suspendTarget._id || suspendTarget.id, {
        reason,
        durationDays,
      });
      showToast(`User ${suspendTarget.name} has been suspended`, 'warning');
      setSuspendTarget(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to suspend user', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBanConfirm = async (reason) => {
    if (!banTarget) return;
    setIsProcessing(true);
    try {
      await usersApi.banUser(banTarget._id || banTarget.id, { reason });
      showToast(`User ${banTarget.name} has been permanently banned`, 'error');
      setBanTarget(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to ban user', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestoreConfirm = async () => {
    if (!restoreTarget) return;
    setIsProcessing(true);
    try {
      await usersApi.restoreUser(restoreTarget._id || restoreTarget.id);
      showToast(`User ${restoreTarget.name} restored to active status`, 'success');
      setRestoreTarget(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to restore user', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Filter & Search Controls Bar */}
      <div className="bg-white border border-[var(--border-color)] rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name, email, handle..."
              className="w-full bg-slate-50/70 border border-[var(--border-color)] text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl pl-9 pr-9 py-2.5 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Role Filter & Refresh */}
          <div className="flex items-center gap-2">
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              className="bg-white border border-[var(--border-color)] text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/30 cursor-pointer font-medium"
            >
              {USER_ROLES.map((r) => (
                <option key={r.id} value={r.id} className="bg-white text-slate-900">
                  {r.label}
                </option>
              ))}
            </select>

            <button
              onClick={fetchUsers}
              className="p-2.5 rounded-xl bg-slate-50 border border-[var(--border-color)] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[var(--color-primary)]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar border-t border-[var(--border-color)]">
          {USER_STATUSES.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setStatus(st.id);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                status === st.id
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table / Mobile Card Content */}
      {isLoading ? (
        <TableSkeleton rows={8} cols={9} />
      ) : error ? (
        <ErrorState
          title="Could not load users"
          message={error}
          onRetry={fetchUsers}
        />
      ) : users.length === 0 ? (
        <EmptyState
          emoji="👥"
          title="No users found"
          message={
            search || status !== 'all' || role !== 'all'
              ? 'No registered users match your current filter settings.'
              : 'There are no registered student accounts on the platform.'
          }
          actionLabel={search || status !== 'all' || role !== 'all' ? 'Clear Filters' : null}
          onAction={() => {
            setSearch('');
            setStatus('all');
            setRole('all');
            setPage(1);
          }}
        />
      ) : (
        <div className="bg-white border border-[var(--border-color)] rounded-2xl shadow-2xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <UserTable
              users={users}
              onView={handleOpenDetail}
              onSuspend={(u) => setSuspendTarget(u)}
              onBan={(u) => setBanTarget(u)}
              onRestore={(u) => setRestoreTarget(u)}
            />
          </div>

          {/* Mobile Card Conversion View */}
          <div className="md:hidden divide-y divide-[var(--border-color)]">
            {users.map((u) => (
              <UserCardMobile
                key={u._id || u.id}
                user={u}
                onView={handleOpenDetail}
                onSuspend={(target) => setSuspendTarget(target)}
                onBan={(target) => setBanTarget(target)}
                onRestore={(target) => setRestoreTarget(target)}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page || page}
            totalPages={pagination.totalPages || 1}
            totalItems={pagination.total}
            pageSize={10}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={Boolean(selectedUser)}
        onClose={() => {
          setSelectedUser(null);
          setUserStats(null);
        }}
        user={selectedUser}
        stats={userStats}
        onSuspend={(u) => setSuspendTarget(u)}
        onBan={(u) => setBanTarget(u)}
        onRestore={(u) => setRestoreTarget(u)}
      />

      {/* Suspend User Modal */}
      <SuspendUserModal
        isOpen={Boolean(suspendTarget)}
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleSuspendConfirm}
        user={suspendTarget}
        isLoading={isProcessing}
      />

      {/* Ban User Modal */}
      <BanUserModal
        isOpen={Boolean(banTarget)}
        onClose={() => setBanTarget(null)}
        onConfirm={handleBanConfirm}
        user={banTarget}
        isLoading={isProcessing}
      />

      {/* Restore User Modal */}
      <RestoreUserModal
        isOpen={Boolean(restoreTarget)}
        onClose={() => setRestoreTarget(null)}
        onConfirm={handleRestoreConfirm}
        user={restoreTarget}
        isLoading={isProcessing}
      />
    </div>
  );
};

export default UsersPage;
