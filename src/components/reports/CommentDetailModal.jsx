import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { MessageSquare, ExternalLink, Calendar, User } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

const CommentDetailModal = ({
  isOpen,
  onClose,
  commentData,
  onInspectPost,
}) => {
  if (!commentData) return null;

  const comment = commentData.comment || commentData;
  const report = commentData.report;
  const commenter = comment.user || report?.reportedUser;
  const postId = comment.post?._id || comment.post || report?.post?._id || report?.post;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reported Comment Investigation"
      subtitle={`Comment ID: ${comment._id || comment.id || 'N/A'}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Commenter Info */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-[var(--color-primary)]">
              {commenter?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                {commenter?.name || 'Student Commenter'}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {commenter?.email || 'Anonymous Student'}
              </span>
            </div>
          </div>

          {comment.createdAt && (
            <span className="text-[11px] text-slate-400 font-mono">
              {formatDateTime(comment.createdAt)}
            </span>
          )}
        </div>

        {/* Comment Text Body */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Reported Comment Statement
          </label>
          <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200 text-sm text-slate-900 leading-relaxed whitespace-pre-wrap select-text font-medium">
            "{comment.text || report?.description || 'Comment content unavailable'}"
          </div>
        </div>

        {/* Parent Post Link if available */}
        {postId && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-[var(--border-color)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <MessageSquare className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Parent Post ID: <strong className="font-mono text-slate-900 font-bold">#{String(postId).substring(0, 8)}</strong></span>
            </div>

            {onInspectPost && (
              <Button
                variant="secondary"
                size="sm"
                icon={ExternalLink}
                onClick={() => {
                  onClose();
                  onInspectPost(postId);
                }}
              >
                Inspect Parent Post
              </Button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-[var(--border-color)]">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CommentDetailModal;
