import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Download, Image as ImageIcon } from 'lucide-react';

const ImageLightbox = ({
  isOpen,
  onClose,
  imageSrc,
  alt = 'Rant attachment',
  caption = '',
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setZoomLevel(1);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        } else if (e.key === '+' || e.key === '=') {
          setZoomLevel((prev) => Math.min(prev + 0.5, 3));
        } else if (e.key === '-') {
          setZoomLevel((prev) => Math.max(prev - 0.5, 1));
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose, imageSrc]);

  const toggleZoom = useCallback((e) => {
    e?.stopPropagation();
    setZoomLevel((prev) => (prev > 1 ? 1 : 2));
  }, []);

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `rant-evidence-${Date.now()}.${blob.type?.split('/')[1] || 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(imageSrc, '_blank', 'noopener,noreferrer');
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && imageSrc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-black/95 p-3 sm:p-6 select-none"
        >
          {/* Header Controls Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl flex items-center justify-between z-10 py-2 px-3 sm:px-4 rounded-2xl bg-slate-900/95 border border-white/10 shadow-lg"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="p-1.5 rounded-lg bg-white/10 text-white shrink-0">
                <ImageIcon className="w-4 h-4 text-sky-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-white truncate font-sans">
                  {caption || 'Attached Media Inspector'}
                </p>
                <p className="text-[10px] sm:text-xs text-white/50 truncate">
                  Full inspection view {zoomLevel > 1 ? `• ${zoomLevel}x Zoom` : ''}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                aria-label="Zoom out"
                title="Zoom out (-)"
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              >
                <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={toggleZoom}
                title="Toggle zoom (1x / 2x)"
                className="px-2.5 py-1 rounded-xl text-xs font-mono font-medium text-white/90 bg-white/10 hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
              >
                {zoomLevel}x
              </button>

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                aria-label="Zoom in"
                title="Zoom in (+)"
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              >
                <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block" />

              <button
                type="button"
                onClick={handleDownload}
                aria-label="Download image"
                title="Download original file"
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="h-4 w-px bg-white/20 mx-1" />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Close image lightbox"
                title="Close (Esc)"
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-rose-600/80 active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Centered Image Viewport */}
          <div
            onClick={toggleZoom}
            className={`relative flex-1 w-full max-w-6xl my-auto flex items-center justify-center overflow-auto p-2 sm:p-4 ${
              zoomLevel > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
          >
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{
                scale: zoomLevel,
                opacity: 1,
              }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              src={imageSrc}
              alt={alt}
              draggable={false}
              className="max-h-[82vh] max-w-[94vw] w-auto h-auto object-contain rounded-xl transition-transform duration-200 select-none"
              onClick={(e) => {
                e.stopPropagation();
                toggleZoom(e);
              }}
            />
          </div>

          {/* Bottom Hint Pill */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="z-10 py-1.5 px-4 rounded-full bg-black/80 border border-white/10 text-white/70 text-[11px] sm:text-xs font-mono tracking-wide pointer-events-none"
          >
            Click image to {zoomLevel > 1 ? 'zoom out' : 'zoom in'} • Esc to close
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ImageLightbox;
