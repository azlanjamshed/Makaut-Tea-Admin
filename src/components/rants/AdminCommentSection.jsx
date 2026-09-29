import React, { useState, useEffect } from 'react';
import { ShieldCheck, Reply, Trash2, Send, Loader2, CornerDownRight, VenetianMask } from 'lucide-react';
import * as commentsApi from '../../api/comments';
import { timeAgo } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

const AdminCommentSection = ({ postId, onCommentCountChange }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const { showToast } = useToast();

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const res = await commentsApi.getComments(postId);
      if (res.success) {
        setComments(res.data || []);
      }
    } catch (err) {
      showToast('Could not load comments for this rant', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const res = await commentsApi.addComment(postId, {
        text: newCommentText.trim(),
        isAnonymous: false,
      });

      if (res.success && res.data) {
        setComments((prev) => [res.data, ...prev]);
        setNewCommentText('');
        showToast('Comment posted as Head of MAKAU-TEA Affairs', 'success');
        onCommentCountChange?.(comments.length + 1);
      }
    } catch (err) {
      showToast(err.message || 'Failed to post comment', 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleAddReply = async (commentId, e) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);
    try {
      const res = await commentsApi.addReply(commentId, {
        text: replyText.trim(),
        isAnonymous: false,
      });

      if (res.success && res.data) {
        setComments((prev) =>
          prev.map((c) => {
            const cId = c.id || c._id;
            if (String(cId) === String(commentId)) {
              return {
                ...c,
                replies: [...(c.replies || []), res.data],
              };
            }
            return c;
          })
        );
        setReplyText('');
        setReplyingToId(null);
        showToast('Reply posted as Head of MAKAU-TEA Affairs', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to post reply', 'error');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsApi.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => (c.id || c._id) !== commentId));
      showToast('Comment deleted', 'success');
      onCommentCountChange?.(Math.max(comments.length - 1, 0));
    } catch (err) {
      showToast(err.message || 'Failed to delete comment', 'error');
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      await commentsApi.deleteReply(commentId, replyId);
      setComments((prev) =>
        prev.map((c) => {
          const cId = c.id || c._id;
          if (String(cId) === String(commentId)) {
            return {
              ...c,
              replies: (c.replies || []).filter((r) => (r.id || r._id) !== replyId),
            };
          }
          return c;
        })
      );
      showToast('Reply deleted', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete reply', 'error');
    }
  };

  return (
    <div className="space-y-4 pt-3 border-t border-[var(--border-color)]">
      {/* Top Comment Input Box */}
      <form onSubmit={handleAddComment} className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-semibold text-[var(--color-primary)]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Posting as Head of MAKAU-TEA Affairs</span>
          </span>
          <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Write an official advisory or response on this post..."
            className="flex-1 bg-slate-50 border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim() || isSubmittingComment}
            className="px-4 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-2xs"
          >
            {isSubmittingComment ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Comment</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-2 py-4">
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-500 italic bg-slate-50 rounded-2xl border border-dashed border-[var(--border-color)]">
          No comments on this rant yet. Be the first to advise or comment!
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {comments.map((comment) => {
            const commentId = comment.id || comment._id;
            const isAdminComment = Boolean(
              comment.isAdminComment ||
              comment.user?.role === 'admin'
            );
            const authorName = isAdminComment
              ? (comment.user?.name || 'Head of MAKAU-TEA Affairs')
              : comment.isAnonymous
              ? comment.user?.anonymousUsername || 'Anonymous Student'
              : comment.user?.name || 'Student';

            return (
              <div
                key={commentId}
                className="p-3 rounded-2xl bg-slate-50 border border-[var(--border-color)] space-y-2 text-xs"
              >
                {/* Comment Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-white border border-[var(--border-color)] flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0 shadow-2xs">
                      {isAdminComment ? <ShieldCheck className="w-3 h-3 text-[var(--color-primary)]" /> : comment.isAnonymous ? <VenetianMask className="w-3.5 h-3.5 text-purple-700" /> : authorName.charAt(0)}
                    </span>
                    <span className={`font-bold font-display ${isAdminComment ? 'text-[var(--color-primary)]' : 'text-slate-900'}`}>
                      {authorName}
                    </span>
                    {isAdminComment ? (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
                        Admin
                      </span>
                    ) : comment.isAnonymous ? (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                        Anon
                      </span>
                    ) : null}
                    <span className="text-[10px] text-slate-400">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setReplyingToId(replyingToId === commentId ? null : commentId)}
                      className="p-1 text-slate-400 hover:text-[var(--color-primary)] rounded-lg hover:bg-slate-200/60 transition-colors"
                      title="Reply"
                    >
                      <Reply className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(commentId)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete comment (Admin)"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-slate-800 pl-8 leading-relaxed whitespace-pre-wrap select-text">
                  {comment.text}
                </p>

                {/* Inline Reply Input */}
                {replyingToId === commentId && (
                  <form
                    onSubmit={(e) => handleAddReply(commentId, e)}
                    className="pl-8 pt-1 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${authorName} as Head of MAKAU-TEA Affairs...`}
                      className="flex-1 bg-white border border-[var(--border-color)] rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--color-primary)]"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim() || isSubmittingReply}
                      className="px-3 py-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {isSubmittingReply ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        'Reply'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingToId(null);
                        setReplyText('');
                      }}
                      className="px-2 py-1.5 text-slate-500 hover:text-slate-800 text-xs"
                    >
                      Cancel
                    </button>
                  </form>
                )}

                {/* Nested Replies */}
                {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                  <div className="pl-6 pt-2 space-y-2 border-l-2 border-[var(--border-color)] ml-2">
                    {comment.replies.map((reply) => {
                      const replyId = reply.id || reply._id;
                      const isReplyAdmin = Boolean(
                        reply.isAdminComment ||
                        reply.user?.role === 'admin'
                      );
                      const replyAuthorName = isReplyAdmin
                        ? (reply.user?.name || 'Head of MAKAU-TEA Affairs')
                        : reply.isAnonymous
                        ? reply.user?.anonymousUsername || 'Anonymous Student'
                        : reply.user?.name || 'Student';

                      return (
                        <div key={replyId} className="space-y-1 p-2 rounded-xl bg-white border border-[var(--border-color)]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <CornerDownRight className="w-3 h-3 text-slate-400" />
                              <span className={`font-bold ${isReplyAdmin ? 'text-[var(--color-primary)]' : 'text-slate-800'}`}>
                                {replyAuthorName}
                              </span>
                              {isReplyAdmin && (
                                <span className="text-[8px] px-1 py-0.2 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
                                  Admin
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400">
                                {timeAgo(reply.createdAt)}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteReply(commentId, replyId)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Delete reply (Admin)"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-slate-800 pl-4 leading-relaxed whitespace-pre-wrap select-text">
                            {reply.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminCommentSection;
