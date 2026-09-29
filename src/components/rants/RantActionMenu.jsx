import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Eye, EyeOff, Trash2, RotateCcw } from 'lucide-react';
import { getRantStatus } from '../../utils/helpers';

const RantActionMenu = ({
  rant,
  onView,
  onHide,
  onUnhide,
  onDelete,
  onRestore,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isOpen]);

  const status = getRantStatus(rant);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-2xl bg-white border border-[var(--border-color)] shadow-xl py-1.5 z-30 text-xs animate-in fade-in zoom-in-95 duration-150">
          {/* Always Available: View */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onView?.(rant);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:text-[var(--color-primary)] hover:bg-slate-50 transition-colors font-medium"
          >
            <Eye className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>View Details</span>
          </button>

          {/* Active Status: Hide, Delete */}
          {status === 'active' && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onHide?.(rant);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-amber-700 hover:bg-amber-50 transition-colors font-medium"
              >
                <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                <span>Hide Rant</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onDelete?.(rant);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Rant</span>
              </button>
            </>
          )}

          {/* Hidden Status: Unhide, Delete */}
          {status === 'hidden' && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onUnhide?.(rant);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-emerald-700 hover:bg-emerald-50 transition-colors font-medium"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-500" />
                <span>Unhide Rant</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onDelete?.(rant);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Rant</span>
              </button>
            </>
          )}

          {/* Deleted Status: Restore */}
          {status === 'deleted' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onRestore?.(rant);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-emerald-700 hover:bg-emerald-50 transition-colors font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
              <span>Restore Rant</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RantActionMenu;
