import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export default function CustomAlert({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  const config = {
    success: { icon: FaCheckCircle, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100' },
    error: { icon: FaExclamationCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
    info: { icon: FaInfoCircle, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  };

  const { icon: Icon, color, bg, border } = config[type] || config.success;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
        className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${bg} ${border} min-w-[300px]`}
      >
        <Icon className={`${color} text-lg`} />
        <p className="text-[11px] font-bold text-[#1A1A2E] flex-1">{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <FaTimes size={12} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
