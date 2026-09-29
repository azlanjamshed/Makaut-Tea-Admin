import React from 'react';
import { MessageSquare, Eye } from 'lucide-react';
import { REACTIONS } from '../../utils/constants';
import { formatCount } from '../../utils/helpers';

const ReactionBar = ({
  reactions = { counts: {}, total: 0, userReaction: null },
  onReact,
  commentsCount = 0,
  views = 0,
  onCommentClick,
  isCommentsOpen = false,
  disabled = false,
  className = '',
}) => {
  const counts = reactions.counts || {};
  const userReaction = reactions.userReaction;

  const reactionColorClasses = {
    '❤️': 'hover:bg-rose-50 text-slate-700 hover:text-rose-800 border-[var(--border-color)]',
    '💩': 'hover:bg-amber-50 text-slate-700 hover:text-amber-800 border-[var(--border-color)]',
    '💀': 'hover:bg-purple-50 text-slate-700 hover:text-purple-800 border-[var(--border-color)]',
  };

  const activeReactionClasses = {
    '❤️': 'bg-rose-50 text-rose-800 border-rose-300 font-bold shadow-2xs',
    '💩': 'bg-amber-50 text-amber-800 border-amber-300 font-bold shadow-2xs',
    '💀': 'bg-purple-50 text-purple-800 border-purple-300 font-bold shadow-2xs',
  };

  return (
    <div className={`flex items-center justify-between gap-2 pt-3 border-t border-[var(--border-color)] ${className}`}>
      {/* Reaction Buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {REACTIONS.map(({ emoji, label }) => {
          const isSelected = userReaction === emoji;
          const count = counts[emoji] || 0;

          return (
            <button
              key={emoji}
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                onReact?.(emoji);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs border transition-all select-none active:scale-95 shadow-2xs ${
                isSelected
                  ? activeReactionClasses[emoji]
                  : `bg-slate-50 ${reactionColorClasses[emoji]}`
              }`}
              title={`${label} (${count})`}
            >
              <span className="text-sm leading-none">{emoji}</span>
              {count > 0 && (
                <span className="tabular-nums font-semibold">{formatCount(count)}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Stats: Comments and Views */}
      <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCommentClick?.();
          }}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all ${
            isCommentsOpen
              ? 'bg-indigo-50 text-[var(--color-primary)] border-indigo-200 font-bold'
              : 'hover:text-slate-900 hover:bg-slate-100 border-transparent'
          }`}
          title="Toggle comments"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="tabular-nums font-medium">{formatCount(commentsCount)}</span>
          <span className="hidden sm:inline">Comments</span>
        </button>

        <div className="inline-flex items-center gap-1 text-slate-400" title="Views">
          <Eye className="w-3.5 h-3.5" />
          <span className="tabular-nums">{formatCount(views)}</span>
        </div>
      </div>
    </div>
  );
};

export default ReactionBar;
