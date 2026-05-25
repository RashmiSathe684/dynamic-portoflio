import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiTrash2, FiUser, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { getContactMessages, deleteContactMessage } from '../../../api/services';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMessages = useCallback(() => {
    setLoading(true);
    getContactMessages()
      .then((res) => {
        if (res.data) {
          // Sort messages descending by date (newest first)
          const sorted = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setMessages(sorted);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load contact messages.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await deleteContactMessage(id);
      setMessages(messages.filter((msg) => msg.id !== id));
      setSuccess('Message deleted successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to delete the message.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown Date';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 select-text">
      <div>
        <h3 className="text-xl font-bold text-text-main mb-1">Inbox Messages</h3>
        <p className="text-sm text-brand-muted">Read and manage inquiries submitted by visitors through the contact form.</p>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-brand-primary/10 border border-brand-border text-brand-primary rounded-2xl text-xs font-bold text-center"
          >
            ✓ {success}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold text-center"
          >
            ⚠ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-brand-muted text-sm font-medium">
          Loading messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 bg-brand-surface border border-brand-border/60 rounded-[32px] p-8 space-y-3">
          <div className="w-12 h-12 mx-auto bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
            <FiMail size={22} />
          </div>
          <h4 className="text-base font-bold text-text-main">No messages yet</h4>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">When visitors send you messages via the contact form, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-surface border border-brand-border/60 rounded-[24px] p-6 flex flex-col md:flex-row gap-6 justify-between relative group hover:border-brand-primary/40 transition-colors"
            >
              {/* Message content */}
              <div className="space-y-3 flex-1">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-brand-muted">
                  <div className="flex items-center gap-1.5 font-bold text-text-main">
                    <FiUser size={13} className="text-brand-primary" />
                    <span>{msg.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiCalendar size={13} />
                    <span>{formatDate(msg.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <FiMail size={13} />
                    <a 
                      href={`mailto:${msg.email}`} 
                      className="text-brand-primary hover:underline"
                      title="Reply by email"
                    >
                      {msg.email}
                    </a>
                  </div>
                </div>

                {/* Message Body */}
                <div className="flex gap-2.5 items-start bg-brand-bg/40 border border-brand-border/40 rounded-2xl p-4">
                  <FiMessageSquare size={16} className="text-brand-muted mt-1 flex-shrink-0" />
                  <p className="text-[13.5px] text-brand-gray leading-relaxed whitespace-pre-wrap select-text">
                    {msg.message}
                  </p>
                </div>
              </div>

              {/* Actions stack */}
              <div className="flex md:flex-col items-end justify-between md:justify-start gap-3">
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="p-3 text-brand-muted hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/20 shadow-sm"
                  title="Delete message"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
