import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginAdmin } from '../../api/services';
import { FiUser, FiLock, FiArrowRight } from 'react-icons/fi';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.setAttribute('data-theme', 'dark');
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginAdmin(form);
      localStorage.setItem('admin_token', res.data.token);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-6 relative transition-colors duration-500">
      {/* Absolute Corner Toggle Switch */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          className="theme-toggle" 
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle theme"
        >
          {darkMode ? '☀' : '🌙'}
        </button>
      </div>

      <motion.div
        className="w-full max-w-md bg-brand-surface border border-brand-border p-10 rounded-[40px] shadow-2xl relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-center mb-10">
          <div className="label-bar inline-block px-3.5 py-1 bg-accent/10 border border-brand-border text-accent rounded-full text-[11px] font-bold uppercase tracking-wider mb-4">
            Secure Access
          </div>
          <h2 className="text-3xl font-[900] text-text-main mb-2">Admin Login</h2>
          <p className="text-brand-gray text-xs uppercase tracking-widest font-bold">Portfolio Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-muted ml-1 uppercase tracking-wider">Username</label>
            <div className="relative group">
              <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-brand-bg border border-brand-border rounded-2xl pl-12 pr-6 py-4 text-text-main font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-muted ml-1 uppercase tracking-wider">Password</label>
            <div className="relative group">
              <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-accent transition-colors" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-brand-bg border border-brand-border rounded-2xl pl-12 pr-6 py-4 text-text-main font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-accent to-accent-h text-white rounded-2xl text-md font-bold hover:shadow-xl hover:shadow-accent/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
          >
            {loading ? 'Authenticating...' : (
              <>
                Login to Dashboard <FiArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}