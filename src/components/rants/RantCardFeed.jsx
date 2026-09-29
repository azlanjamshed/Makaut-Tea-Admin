import React, { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import RantActionMenu from './RantActionMenu';
import ReactionBar from './ReactionBar';
import AdminCommentSection from './AdminCommentSection';
import ImageLightbox from '../common/ImageLightbox';
import { Building2, ShieldCheck, AlertTriangle, ZoomIn, VenetianMask } from 'lucide-react';
import { timeAgo, resolveImageUrl, getRantStatus } from '../../utils/helpers';
import * as rantsApi from '../../api/rants';
import { useToast } from '../../context/ToastContext';

const RantCardFeed = ({
  rant,
  onInspect,
  onHide,
  onUnhide,
  onDelete,
  onRestore,
}) => {
  const [postData, setPostData] = useState(rant);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { showToast } = useToast();

  const isOfficial = Boolean(
    postData.isOfficial || postData.isAdminPost || postData.user?.role === 'admin'
  );

  const authorName = isOfficial
    ? (postData.user?.name || 'Head of MAKAU-TEA Affairs')
    : postData.isAnonymous
    ? postData.user?.anonymousUsername || 'Anonymous Student'
    : postData.user?.name || 'Student';

  const authorImage = isOfficial
    ? (postData.user?.image || '/logo.png')
    : postData.isAnonymous
    ? ''
    : postData.user?.image;

  const status = getRantStatus(postData);
  const imageSrc = postData.image ? resolveImageUrl(postData.image) : null;
  const postId = postData._id || postData.id;

  const handleReact = async (emoji) => {
    try {
      const res = await rantsApi.reactToPost(postId, emoji);
      if (res.data) {
        setPostData(res.data);
      } else {
        // Optimistic toggle fallback
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
      showToast(err.message || 'Failed to save reaction', 'error');
    }
  };

  return (
    <div className="bg-white border border-[var(--border-color)] rounded-3xl p-5 space-y-4 shadow-2xs hover:border-slate-300 transition-colors">
      {/* Official Announcement Header */}
      {isOfficial && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-[var(--color-primary)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-xs font-bold font-mono uppercase tracking-wider">
              Official Campus Announcement
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[var(--color-primary)] border border-indigo-200 shadow-2xs">
            Verified
          </span>
        </div>
      )}

      {/* Top Header: Author + Meta + Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={isOfficial ? 'p-0.5 rounded-full ring-2 ring-[var(--color-primary)]/40 shrink-0' : 'shrink-0'}>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-[var(--border-color)] flex items-center justify-center text-sm font-bold text-slate-700 overflow-hidden shadow-2xs">
              {authorImage ? (
                <img src={authorImage} alt={authorName} className="w-full h-full object-cover" />
              ) : isOfficial ? (
                <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
              ) : postData.isAnonymous ? (
                <VenetianMask className="w-4 h-4 text-purple-700" />
              ) : (
                authorName.charAt(0)
              )}
            </div>
          </div>

          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-sm font-display truncate ${isOfficial ? 'text-[var(--color-primary)]' : 'text-slate-900'}`}>
                {authorName}
              </span>
              {isOfficial ? (
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
                  Admin
                </span>
              ) : postData.isAnonymous ? (
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                  Anon
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              {(postData.semester || postData.department) && (
                <>
                  <span className="font-medium truncate max-w-[160px] text-slate-600">
                    {postData.semester || postData.department}
                  </span>
                  <span>·</span>
                </>
              )}
              <span>{timeAgo(postData.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Right Status Badge & Moderation Menu */}
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={status} />
          {postData.reportsCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle className="w-3 h-3" />
              <span>{postData.reportsCount}</span>
            </span>
          )}

          <RantActionMenu
            rant={postData}
            onInspect={() => onInspect?.(postData)}
            onHide={() => onHide?.(postData)}
            onUnhide={() => onUnhide?.(postData)}
            onDelete={() => onDelete?.(postData)}
            onRestore={() => onRestore?.(postData)}
          />
        </div>
      </div>

      {/* Rant Body */}
      <p className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-wrap select-text">
        {postData.text}
      </p>

      {/* Optional Photo Attachment */}
      {imageSrc && (
        <div className="relative rounded-2xl overflow-hidden border border-[var(--border-color)] bg-slate-100 max-h-96 flex items-center justify-center">
          <img
            src={imageSrc}
            alt="Rant attachment"
            onClick={() => setIsLightboxOpen(true)}
            className="max-h-96 w-auto h-auto max-w-full object-contain cursor-zoom-in hover:scale-[1.01] transition-transform duration-200"
          />
          <div
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/70 hover:bg-black/80 text-white text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            <ZoomIn className="w-3.5 h-3.5 text-sky-300" />
            <span>Full Image</span>
          </div>

          <ImageLightbox
            isOpen={isLightboxOpen}
            onClose={() => setIsLightboxOpen(false)}
            imageSrc={imageSrc}
            alt={`Photo by ${authorName}`}
            caption={`Attachment posted by ${authorName}`}
          />
        </div>
      )}

      {/* Interactive Reaction & Comment Bar */}
      <ReactionBar
        reactions={postData.reactions}
        onReact={handleReact}
        commentsCount={postData.commentsCount || 0}
        views={postData.views || 0}
        onCommentClick={() => setIsCommentsOpen((prev) => !prev)}
        isCommentsOpen={isCommentsOpen}
      />

      {/* Expandable Live Comments Drawer */}
      {isCommentsOpen && (
        <AdminCommentSection
          postId={postId}
          onCommentCountChange={(count) =>
            setPostData((prev) => ({ ...prev, commentsCount: count }))
          }
        />
      )}
    </div>
  );
};

export default RantCardFeed;
