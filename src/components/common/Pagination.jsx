import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize = 10,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1 && (!totalItems || totalItems <= pageSize)) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : currentPage * pageSize;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border-t border-[var(--border-color)] rounded-b-2xl text-xs text-slate-500 ${className}`}
    >
      <div>
        {totalItems ? (
          <span>
            Showing <strong className="text-slate-900 font-semibold">{startItem}</strong> to{' '}
            <strong className="text-slate-900 font-semibold">{endItem}</strong> of{' '}
            <strong className="text-slate-900 font-semibold">{totalItems}</strong> entries
          </span>
        ) : (
          <span>
            Page <strong className="text-slate-900 font-semibold">{currentPage}</strong> of{' '}
            <strong className="text-slate-900 font-semibold">{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          icon={ChevronLeft}
          aria-label="Previous page"
        >
          Previous
        </Button>

        <span className="px-3 py-1 font-semibold text-slate-700 bg-slate-50 rounded-lg border border-[var(--border-color)]">
          {currentPage} / {totalPages || 1}
        </span>

        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
