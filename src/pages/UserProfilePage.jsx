import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { CardSkeleton } from '../components/common/Skeleton';
import SuspendUserModal from '../components/users/SuspendUserModal';
import BanUserModal from '../components/users/BanUserModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import RantDetailModal from '../components/rants/RantDetailModal';
import HideRantModal from '../components/rants/HideRantModal';
import DeleteRantModal from '../components/rants/DeleteRantModal';
import { useToast } from '../context/ToastContext';
import * as usersApi from '../api/users';
import * as rantsApi from '../api/rants';
import { formatDateTime, timeAgo, resolveImageUrl } from '../utils/helpers';
import {
  ArrowLeft,
  Mail,
  Building2,
  Calendar,
  Shield,
  ShieldAlert,
  ShieldCheck,
  FileText,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Flame,
} from 'lucide-react';

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState(null);

  // Moderation modals
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [isBanOpen, setIsBanOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Post detail & moderation modals
  const [selectedPost, setSelectedPost] = useState(null);
  const [hideTarget, setHideTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeTab, setActiveTab] = useState('rants');

  const fetchUserDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await usersApi.getUserById(id);
      if (res.success && res.data) {
        setUserData(res.data.user || res.data);
        setStats(res.data.stats || {});
      } else {
        throw new Error(res.message || 'User not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const res = await usersApi.getUserPosts(id);
      if (res.success && res.data) {
        setUserPosts(res.data || []);
      }
    } catch (err) {
      // silently handle posts fetch
      setUserPosts([]);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserDetails();
      fetchUserPosts();
    }
  }, [id]);

  // Suspend action
  const handleSuspendConfirm = async ({ reason, durationDays }) => {
    setIsProcessing(true);
    try {
      await usersApi.suspendUser(id, { reason, durationDays });
      showToast('User account suspended successfully', 'warning');
      setIsSuspendOpen(false);
      fetchUserDetails();
    } catch (err) {
      showToast(err.message || 'Failed to suspend user', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Ban action
  const handleBanConfirm = async ({ reason }) => {
    setIsProcessing(true);
    try {
      await usersApi.banUser(id, { reason });
      showToast('User permanently banned from platform', 'error');
      setIsBanOpen(false);
      fetchUserDetails();
    } catch (err) {
      showToast(err.message || 'Failed to ban user', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Restore action
  const handleRestoreConfirm = async () => {
    setIsProcessing(true);
    try {
      await usersApi.restoreUser(id);
      showToast('User account restored to active status', 'success');
      setIsRestoreOpen(false);
      fetchUserDetails();
    } catch (err) {
      showToast(err.message || 'Failed to restore user', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Post Moderation
  const handleHideConfirm = async ({ reason }) => {
    if (!hideTarget) return;
    try {
      await rantsApi.hidePost(hideTarget._id || hideTarget.id, reason);
      showToast('Rant hidden from public view', 'success');
      setHideTarget(null);
      fetchUserPosts();
    } catch (err) {
      showToast(err.message || 'Failed to hide rant', 'error');
    }
  };

  const handleUnhidePost = async (post) => {
    try {
      await rantsApi.unhidePost(post._id || post.id);
      showToast('Rant unhidden and restored to public feed', 'success');
      fetchUserPosts();
    } catch (err) {
      showToast(err.message || 'Failed to unhide rant', 'error');
    }
  };

  const handleDeleteConfirm = async ({ reason }) => {
    if (!deleteTarget) return;
    try {
      await rantsApi.deletePost(deleteTarget._id || deleteTarget.id, reason);
      showToast('Rant marked as deleted', 'success');
      setDeleteTarget(null);
      fetchUserPosts();
    } catch (err) {
      showToast(err.message || 'Failed to delete rant', 'error');
    }
  };

  const handleRestorePost = async (post) => {
    try {
      await rantsApi.restorePost(post._id || post.id);
      showToast('Rant restored successfully', 'success');
      fetchUserPosts();
    } catch (err) {
      showToast(err.message || 'Failed to restore rant', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-slate-200 animate-pulse rounded-xl" />
        <CardSkeleton />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/users')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Users</span>
        </button>
        <ErrorState
          title="Could not load user profile"
          message={error || 'The requested student user does not exist or was removed.'}
          onRetry={fetchUserDetails}
        />
      </div>
    );
  }

  const status = (userData.status || 'active').toLowerCase();
  const isSuspended = status === 'suspended';
  const isBanned = status === 'banned';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/users')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[var(--border-color)] text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Users</span>
        </button>

        <div className="flex items-center gap-2">
          <Link
            to={`/reports?search=${encodeURIComponent(userData.email || userData.name || '')}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 text-xs font-bold transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Search Reports on User</span>
          </Link>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-3xl text-[var(--color-primary)] shadow-sm shrink-0 overflow-hidden">
            {userData.image ? (
              <img
                src={resolveImageUrl(userData.image)}
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{userData.name?.charAt(0) || 'U'}</span>
            )}
          </div>

          {/* User Primary Info */}
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                  {userData.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  {userData.email}
                </p>
              </div>

              {/* Status and Role Badges */}
              <div className="flex items-center gap-2 justify-center sm:justify-end flex-wrap">
                <StatusBadge status={userData.status} />
                <span className="px-2.5 py-1 rounded-full text-xs font-mono uppercase bg-slate-100 text-slate-700 font-bold border border-slate-200">
                  {userData.role || 'student'}
                </span>
              </div>
            </div>

            {/* Department, Semester, Anonymous Handle */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 text-xs text-slate-600 pt-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Building2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>{userData.department || 'General Campus'}</span>
              </span>

              {userData.semester && (
                <>
                  <span>·</span>
                  <span className="font-medium">
                    Semester: <strong className="text-slate-800">{userData.semester}</strong>
                  </span>
                </>
              )}

              {userData.anonymousUsername && (
                <>
                  <span>·</span>
                  <span className="font-mono font-bold text-[var(--color-primary)] bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                    @{userData.anonymousUsername}
                  </span>
                </>
              )}

              <span>·</span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {formatDateTime(userData.createdAt)}</span>
              </span>
            </div>

            {/* Bio if provided */}
            {userData.bio && (
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-[var(--border-color)] italic mt-2">
                "{userData.bio}"
              </p>
            )}

            {/* Suspension / Ban Warning Notice */}
            {isSuspended && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Account Suspended until {userData.suspendedUntil ? formatDateTime(userData.suspendedUntil) : 'Further Review'}</span>
                </div>
                {userData.suspensionReason && (
                  <p className="text-amber-800/90 pl-6">Reason: {userData.suspensionReason}</p>
                )}
              </div>
            )}

            {isBanned && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                <div className="flex items-center gap-2 font-bold text-rose-800">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Account Permanently Banned</span>
                </div>
                {userData.banReason && (
                  <p className="text-rose-800/90 pl-6">Reason: {userData.banReason}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Moderation Controls Toolbar */}
        <div className="pt-4 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-semibold text-slate-500 font-mono">
            Admin Moderation Actions:
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {!isSuspended && !isBanned && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsSuspendOpen(true)}
                  className="text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100"
                >
                  Suspend Account
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIsBanOpen(true)}
                >
                  Ban Account
                </Button>
              </>
            )}

            {(isSuspended || isBanned) && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsRestoreOpen(true)}
                icon={RotateCcw}
              >
                Restore Account Access
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[var(--border-color)] rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-mono">
            Rants Posted
          </span>
          <span className="text-2xl font-black text-slate-900 mt-2 block">
            {stats?.postsCount ?? userPosts.length}
          </span>
        </div>

        <div className="bg-white border border-[var(--border-color)] rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-mono">
            Comments Left
          </span>
          <span className="text-2xl font-black text-slate-900 mt-2 block">
            {stats?.commentsCount ?? 0}
          </span>
        </div>

        <div className="bg-white border border-[var(--border-color)] rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-mono">
            Reports Filed Against
          </span>
          <span className={`text-2xl font-black mt-2 block ${stats?.reportsAgainstUser > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {stats?.reportsAgainstUser ?? 0}
          </span>
        </div>

        <div className="bg-white border border-[var(--border-color)] rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-mono">
            Account Status
          </span>
          <span className="text-lg font-bold capitalize mt-2 block text-slate-800">
            {userData.status || 'Active'}
          </span>
        </div>
      </div>

      {/* Profile Section Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
        <button
          onClick={() => setActiveTab('rants')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'rants'
              ? 'bg-[var(--color-primary)] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          User's Rants & Posts ({userPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'account'
              ? 'bg-[var(--color-primary)] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Account & Moderation Details
        </button>
      </div>

      {/* Tab 1: User's Rants & Posts */}
      {activeTab === 'rants' && (
        <div className="space-y-4">
          {isLoadingPosts ? (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : userPosts.length === 0 ? (
            <EmptyState
              emoji="📝"
              title="No rants posted"
              message="This student user has not published any rants yet."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userPosts.map((post) => {
                const isHidden = post.isHidden;
                const isDeleted = post.isDeleted;
                const postImage = post.image ? resolveImageUrl(post.image) : null;

                return (
                  <div
                    key={post._id || post.id}
                    className="bg-white border border-[var(--border-color)] rounded-2xl p-5 shadow-2xs space-y-3 hover:border-slate-300 transition-colors flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono">
                            #{String(post._id || post.id).substring(0, 8)}
                          </span>
                          {post.isAnonymous && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              Anonymous
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px]">{timeAgo(post.createdAt)}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-800 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                        {post.text}
                      </p>

                      {postImage && (
                        <div className="rounded-xl overflow-hidden max-h-40 bg-slate-100 border border-[var(--border-color)]">
                          <img
                            src={postImage}
                            alt="Post media"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-orange-500" />
                          <span>{post.reactions?.total || 0}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                          <span>{post.commentsCount || 0}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPost(post)}
                          icon={Eye}
                          title="Inspect Rant"
                        />

                        {!isHidden && !isDeleted && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setHideTarget(post)}
                            icon={EyeOff}
                            title="Hide Rant"
                            className="text-amber-600 hover:bg-amber-50"
                          />
                        )}

                        {isHidden && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnhidePost(post)}
                            icon={Eye}
                            title="Unhide Rant"
                            className="text-emerald-600 hover:bg-emerald-50"
                          />
                        )}

                        {!isDeleted && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(post)}
                            icon={Trash2}
                            title="Delete Rant"
                            className="text-rose-500 hover:bg-rose-50"
                          />
                        )}

                        {isDeleted && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestorePost(post)}
                            icon={RotateCcw}
                            title="Restore Rant"
                            className="text-emerald-600 hover:bg-emerald-50"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Account Details */}
      {activeTab === 'account' && (
        <div className="bg-white border border-[var(--border-color)] rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
            Account Technical Metadata
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase block font-bold">
                Unique Database ID
              </span>
              <span className="font-mono text-slate-900 font-bold select-all block">
                {userData._id || userData.id}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase block font-bold">
                Registration Timestamp
              </span>
              <span className="text-slate-900 font-semibold block">
                {formatDateTime(userData.createdAt)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase block font-bold">
                Department Affiliation
              </span>
              <span className="text-slate-900 font-semibold block">
                {userData.department || 'Not specified'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase block font-bold">
                Semester Cohort
              </span>
              <span className="text-slate-900 font-semibold block">
                {userData.semester || 'All Semesters'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Suspend User Modal */}
      <SuspendUserModal
        isOpen={isSuspendOpen}
        onClose={() => setIsSuspendOpen(false)}
        onConfirm={handleSuspendConfirm}
        user={userData}
        isLoading={isProcessing}
      />

      {/* Ban User Modal */}
      <BanUserModal
        isOpen={isBanOpen}
        onClose={() => setIsBanOpen(false)}
        onConfirm={handleBanConfirm}
        user={userData}
        isLoading={isProcessing}
      />

      {/* Restore User Modal */}
      <ConfirmationModal
        isOpen={isRestoreOpen}
        onClose={() => setIsRestoreOpen(false)}
        onConfirm={handleRestoreConfirm}
        title="Restore Account Access?"
        message={`Are you sure you want to lift restrictions on ${userData.name}? The account will be marked active immediately.`}
        confirmText="Restore Account"
        variant="primary"
        isLoading={isProcessing}
      />

      {/* Rant Detail Modal */}
      <RantDetailModal
        isOpen={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        rant={selectedPost}
        onHide={(r) => {
          setSelectedPost(null);
          setHideTarget(r);
        }}
        onUnhide={handleUnhidePost}
        onDelete={(r) => {
          setSelectedPost(null);
          setDeleteTarget(r);
        }}
        onRestore={handleRestorePost}
      />

      {/* Hide Rant Modal */}
      <HideRantModal
        isOpen={Boolean(hideTarget)}
        onClose={() => setHideTarget(null)}
        onConfirm={handleHideConfirm}
        rant={hideTarget}
        isLoading={isProcessing}
      />

      {/* Delete Rant Modal */}
      <DeleteRantModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        rant={deleteTarget}
        isLoading={isProcessing}
      />
    </div>
  );
};

export default UserProfilePage;
