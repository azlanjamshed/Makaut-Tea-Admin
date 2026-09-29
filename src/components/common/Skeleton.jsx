import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 rounded-xl ${className}`}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white border border-[var(--border-color)] shadow-2xs rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="w-full bg-white border border-[var(--border-color)] shadow-2xs rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-4 bg-slate-50/50">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-[var(--border-color)]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex items-center gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="bg-white border border-[var(--border-color)] shadow-2xs rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-8 w-44 rounded-xl" />
      </div>
      <Skeleton className="h-56 w-full rounded-2xl" />
    </div>
  );
};

export default Skeleton;
