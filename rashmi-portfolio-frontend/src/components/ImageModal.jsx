import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function ImageModal({ images = [], initialIndex = 0, title, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const imageUrl = Array.isArray(images) ? images[currentIndex] : images;

  const handlePrev = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, handlePrev, handleNext]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" />

        {/* Modal Content */}
        <motion.div
          className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20">
            <h3 className="text-white text-lg font-semibold tracking-tight">
              {title} {images.length > 1 && <span className="text-white/40 ml-2">({currentIndex + 1} / {images.length})</span>}
            </h3>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-all z-20 border border-white/10"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-all z-20 border border-white/10"
              >
                <FiChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image */}
          <div className="w-full h-full flex items-center justify-center p-4">
            <motion.img
              key={imageUrl}
              src={imageUrl}
              alt={title || 'Preview'}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl select-none"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
