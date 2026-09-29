import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import ImageLightbox from '../common/ImageLightbox';
import ReactionBar from './ReactionBar';
import AdminCommentSection from './AdminCommentSection';
import { Eye, EyeOff, Trash2, RotateCcw, MessageSquare, Flame, AlertTriangle, Calendar, Building2, User, ShieldCheck, ZoomIn, VenetianMask } from 'lucide-react';
import { formatDateTime, resolveImageUrl, getRantStatus } from '../../utils/helpers';
import * as rantsApi from '../../api/rants';

const RantDetailModal = ({
  isOpen,
  onClose,
  rant,
  onHide,
  onUnhide,
  onDelete,
  onRestore,
}) => {
  if (!rant) return null;

  const [postData, setPostData] = useState(rant);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    setPostData(rant);
  }, [rant]);

  const isOfficial = Boolean(
    postData.isOfficial || postData.isAdminPost || postData.user?.role === 'admin'
  );

  const authorName = isOfficial
    ? (postData.user?.name || 'Head of MAKAU-TEA Affairs')
    : postData.isAnonymous
    ? postData.user?.anonymousUsername || 'Anonymous Student'
    : postData.user?.name || 'Student';

  const authorEmail = postData.isAnonymous ? 'Identity Hidden' : postData.user?.email || '—';
  const status = getRantStatus(postData);
  const imageSrc = postData.image ? resolveImageUrl(postData.image) : null;
  const postId = postData._id || postData.id;

  const handleReact = async (emoji) => {
    try {
      const res = await rantsApi.reactToPost(postId, emoji);
      if (res.data) {
        setPostData(res.data);
      } else {
        setPostData((prev) => {
          const currentCounts = { ...(prev.reactions?.counts || {}) };
          let userReaction = prev.reactions?.userReaction;

          if (userReaction === emoji) {
            currentCounts[emoji] = Math.max((currentCounts[emoji] || 1) - 1, 0);
            userReaction = null;
          } else {
            if (userReaction && currentCounts[userReaction]) {
              currentCounts[userReaction] = Math.max(currentCounts[userReaction] - 1, 0);
            }
            currentCounts[emoji] = (currentCounts[emoji] || 0) + 1;
            userReaction = emoji;
          }

          const total = Object.values(currentCounts).reduce((a, b) => a + b, 0);
          return {
            ...prev,
            reactions: {
              counts: currentCounts,
              total,
              userReaction,
            },
          };
        });
      }
    } catch (err) {
      // Silently handle reaction error
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rant Moderation Details"
      subtitle={`Rant ID: ${rant._id || rant.id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Official Banner if Admin Post */}
        {isOfficial && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-[var(--color-primary)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider font-mono">
                  Official Campus Announcement
                </p>
                <p className="text-[11px] text-slate-600">
                  Broadcasted by University Administration
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[var(--color-primary)] border border-indigo-200 shadow-2xs">
              Verified
            </span>
          </div>
        )}

        {/* Top Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-[var(--border-color)] flex items-center justify-center text-sm font-bold text-slate-700 shadow-2xs">
              {isOfficial ? <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" /> : rant.isAnonymous ? <VenetianMask className="w-5 h-5 text-purple-700" /> : authorName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 font-display">
                  {authorName}
                </span>
                {isOfficial ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
                    Administrator
                  </span>
                ) : rant.isAnonymous ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold border border-slate-300">
                    Anonymous
                  </span>
                ) : null}
              </div>
              <span className="text-xs text-slate-500">{authorEmail}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            {rant.reportsCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-3 h-3" />
                <span>{rant.reportsCount} Reports</span>
              </span>
            )}
          </div>
        </div>

        {/* Rant Text Body */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
            Rant Statement
          </label>
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-[var(--border-color)] text-sm text-slate-800 leading-relaxed whitespace-pre-wrap select-text font-medium">
            {rant.text}
          </div>
        </div>

        {/* Optional Attached Media */}
        {imageSrc && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
                Attached Photo
              </label>
              <span className="text-[11px] text-[var(--color-primary)] font-medium">
                Click to inspect full size
              </span>
            </div>
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="group/img relative rounded-2xl overflow-hidden border border-[var(--border-color)] bg-slate-100 max-h-80 flex items-center justify-center cursor-zoom-in hover:border-[var(--color-primary)]/50 transition-all"
              title="Click to view full photo"
            >
              <img
                src={imageSrc}
                alt="Rant attachment"
                className="max-h-80 w-auto h-auto max-w-full object-contain transition-transform duration-300 group-hover/img:scale-[1.015]"
              />
              <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/70 hover:bg-black/80 text-white text-[11px] flex items-center gap-1.5 transition-colors shadow-sm">
                <ZoomIn className="w-3.5 h-3.5 text-sky-300" />
                <span>Inspect</span>
              </div>
            </div>

            <ImageLightbox
              isOpen={isLightboxOpen}
              onClose={() => setIsLightboxOpen(false)}
              imageSrc={imageSrc}
              alt={`Photo by ${authorName}`}
              caption={`Post evidence by ${authorName}`}
            />
          </div>
        )}

        {/* Meta Grid: Department, Date, Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-50 border border-[var(--border-color)]">
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono uppercase">
              <Building2 className="w-3 h-3 text-[var(--color-primary)]" />
              <span>Target / Sem</span>
            </span>
            <span className="text-xs font-bold text-slate-800 mt-1 block">
              {rant.semester || rant.department || 'All Semesters'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-[var(--border-color)]">
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono uppercase">
              <Flame className="w-3 h-3 text-orange-500" />
              <span>Reactions</span>
            </span>
            <span className="text-xs font-bold text-slate-800 mt-1 block">
              {postData.reactions?.total || postData.reactions?.length || postData.reactionCount || 0}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-[var(--border-color)]">
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono uppercase">
              <MessageSquare className="w-3 h-3 text-[var(--color-primary)]" />
              <span>Comments</span>
            </span>
            <span className="text-xs font-bold text-slate-800 mt-1 block">
              {postData.commentsCount || 0}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-[var(--border-color)]">
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono uppercase">
              <Eye className="w-3 h-3 text-purple-500" />
              <span>Views</span>
            </span>
            <span className="text-xs font-bold text-slate-800 mt-1 block">
              {postData.views || 0}
            </span>
          </div>
        </div>

        {/* Creation Timestamp & Moderation Notes */}
        <div className="text-xs text-slate-500 flex items-center justify-between px-1">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Posted: {formatDateTime(postData.createdAt)}</span>
          </span>
          {postData.hiddenReason && (
            <span className="text-amber-700 font-medium">
              Reason: {postData.hiddenReason}
            </span>
          )}
        </div>

        {/* Interactive Reaction Bar */}
        <div className="bg-slate-50/70 p-3 rounded-2xl border border-[var(--border-color)]">
          <div className="text-xs font-semibold text-slate-600 mb-2 font-mono uppercase">
            Campus Reactions & Admin Likes
          </div>
          <ReactionBar
            reactions={postData.reactions}
            onReact={handleReact}
            commentsCount={postData.commentsCount || 0}
            views={postData.views || 0}
          />
        </div>

        {/* Live Comments Thread & Interaction */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-[var(--border-color)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>Campus Discussion & Comments</span>
            </span>
          </div>
          <AdminCommentSection
            postId={postId}
            onCommentCountChange={(count) =>
              setPostData((prev) => ({ ...prev, commentsCount: count }))
            }
          />
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-[var(--border-color)]">
          {status === 'active' && (
            <>
              <Button
                variant="warning"
                size="sm"
                icon={EyeOff}
                onClick={() => {
                  onClose();
                  onHide?.(rant);
                }}
              >
                Hide Rant
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => {
                  onClose();
                  onDelete?.(rant);
                }}
              >
                Delete Rant
              </Button>
            </>
          )}

          {status === 'hidden' && (
            <>
              <Button
                variant="primary"
                size="sm"
                icon={Eye}
                onClick={() => {
                  onClose();
                  onUnhide?.(rant);
                }}
              >
                Unhide Rant
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => {
                  onClose();
                  onDelete?.(rant);
                }}
              >
                Delete Rant
              </Button>
            </>
          )}

          {status === 'deleted' && (
            <Button
              variant="primary"
              size="sm"
              icon={RotateCcw}
              onClick={() => {
                onClose();
                onRestore?.(rant);
              }}
            >
              Restore Rant
            </Button>
          )}

          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RantDetailModal;
