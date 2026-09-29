import React from 'react';
import {
  Inbox,
  Flame,
  MessageSquare,
  Search,
  Bell,
  User,
  Heart,
  FileText,
  AlertTriangle,
  Users,
  Lightbulb,
  Ghost,
} from 'lucide-react';
import Button from './Button';

const EMOJI_ICON_MAP = {
  '📭': Inbox,
  '💤': Ghost,
  '🔥': Flame,
  '💬': MessageSquare,
  '🔍': Search,
  '🔔': Bell,
  '👤': User,
  '👥': Users,
  '❤️': Heart,
  '📝': FileText,
  '✍️': FileText,
  '🚨': AlertTriangle,
  '💡': Lightbulb,
  '📢': Bell,
};

const EmptyState = ({
  icon: Icon,
  emoji,
  title = 'No items found',
  message = 'There are no records matching your current filter criteria.',
  actionLabel,
  onAction,
  className = '',
}) => {
  const MappedIcon = emoji && EMOJI_ICON_MAP[emoji] ? EMOJI_ICON_MAP[emoji] : null;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white border border-[var(--border-color)] shadow-2xs space-y-3 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-[var(--border-color)] flex items-center justify-center shadow-2xs text-[var(--color-primary)]">
        {Icon ? (
          <Icon className="w-7 h-7 stroke-[1.75]" />
        ) : MappedIcon ? (
          <MappedIcon className="w-7 h-7 stroke-[1.75]" />
        ) : (
          <Inbox className="w-7 h-7 stroke-[1.75]" />
        )}
      </div>

      <div className="space-y-1 max-w-sm">
        <h4 className="text-base font-bold text-slate-900 font-display">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {message}
        </p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
