import React from 'react';
import Card from '../common/Card';
import { formatCount } from '../../utils/helpers';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'sky', // 'sky' | 'emerald' | 'purple' | 'amber' | 'rose'
  href,
  badge,
}) => {
  const colorStyles = {
    sky: 'bg-indigo-50 text-[var(--color-primary)] border-indigo-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
  };

  const content = (
    <div className="flex flex-col justify-between h-full space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${colorStyles[color] || colorStyles.sky}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display tabular-nums tracking-tight">
            {typeof value === 'number' ? formatCount(value) : value ?? '0'}
          </span>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 flex items-center justify-between">
            <span>{subtitle}</span>
            {href && <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[var(--color-primary)] transition-colors" />}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="block group">
        <Card hoverable className="h-full group-hover:border-[var(--color-primary)]/40 transition-all">
          {content}
        </Card>
      </Link>
    );
  }

  return <Card className="h-full">{content}</Card>;
};

export default StatCard;
