import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminProjects from './modules/AdminProjects';
import AdminAchievements from './modules/AdminAchievements';
import AdminCertifications from './modules/AdminCertifications';
import AdminInternships from './modules/AdminInternships';
import AdminProfile from './modules/AdminProfile';
import AdminMessages from './modules/AdminMessages';
import { FiGrid, FiAward, FiFileText, FiLogOut, FiBriefcase, FiUser, FiMail, FiSun, FiMoon, FiHome } from 'react-icons/fi';

const tabs = [
  { id: 'projects', label: 'Projects', icon: FiGrid },
  { id: 'internships', label: 'Internships', icon: FiBriefcase },
  { id: 'achievements', label: 'Achievements', icon: FiAward },
  { id: 'certifications', label: 'Certifications', icon: FiFileText },
  { id: 'profile', label: 'Profile Settings', icon: FiUser },
  { id: 'messages', label: 'Messages', icon: FiMail },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
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

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-brand-bg py-12 px-6 transition-colors duration-500 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <div className="label-bar inline-block px-3 py-1 bg-accent/10 border border-brand-border text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              Portfolio Manager
            </div>
            <h2 className="text-4xl font-[800] text-text-main">RS Dashboard</h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Home button to redirect to portfolio page */}
            <button 
              className="theme-toggle" 
              onClick={() => navigate('/')}
              title="Go to Portfolio Home"
            >
              <FiHome size={18} />
            </button>
            {/* Theme toggle switch in dashboard header */}
            <button 
              className="theme-toggle" 
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle theme"
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-brand-surface border border-brand-border rounded-2xl text-sm font-bold text-brand-gray hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/10 transition-all shadow-sm"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
        
        <div className="bg-brand-surface border border-brand-border rounded-[32px] overflow-hidden shadow-xl flex flex-col md:flex-row min-h-[600px]">
          {/* Sidebar */}
          <div className="w-full md:w-72 bg-brand-bg/40 border-b md:border-b-0 md:border-r border-brand-border p-4 md:p-6 flex flex-row md:flex-col gap-2 overflow-x-auto md:max-h-[calc(100vh-12rem)] md:overflow-y-auto scrollbar-none">
            <p className="hidden md:block text-[10px] font-bold text-brand-muted uppercase tracking-[2px] mb-4 ml-2">Main Menu</p>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2.5 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-sm transition-all group shrink-0 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-accent to-accent-h text-white font-bold shadow-lg shadow-accent/20'
                    : 'text-brand-gray hover:bg-brand-bg hover:text-accent'
                }`}
              >
                <tab.icon className={activeTab === tab.id ? 'text-white' : 'text-brand-muted group-hover:text-accent'} size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 sm:p-8 md:p-12 bg-transparent overflow-y-auto">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'projects' && <AdminProjects />}
              {activeTab === 'internships' && <AdminInternships />}
              {activeTab === 'achievements' && <AdminAchievements />}
              {activeTab === 'certifications' && <AdminCertifications />}
              {activeTab === 'profile' && <AdminProfile />}
              {activeTab === 'messages' && <AdminMessages />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

