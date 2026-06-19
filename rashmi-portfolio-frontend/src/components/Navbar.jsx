import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const links = [
  'Home',
  'About',
  'Skills',
  'Projects',
  'Achievements',
  'Certifications',
  'Experience',
  'Education',
  'Contact'
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const scrollTo = (id) => {
    const sectionId = id.toLowerCase();
    const element = document.getElementById(sectionId);
    if (element) {
      // Offset for sticky navbar height (62px)
      const navbarHeight = 62;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] backdrop-blur-[20px] bg-brand-surface/75 border-b border-brand-border h-[62px] px-6 lg:px-12 flex items-center justify-between transition-colors duration-500">
      {/* Logo */}
      <div 
        className="nav-logo font-bold text-[20px] text-accent tracking-tight cursor-pointer"
        onClick={() => scrollTo('home')}
      >
        RS.
      </div>

      {/* Desktop Links */}
      <div className="hidden lg:flex items-center gap-[24px]">
        {links.map((link) => (
          <button
            key={link}
            onClick={() => scrollTo(link)}
            className="text-[14.5px] font-semibold text-brand-gray hover:text-accent transition-colors duration-200"
          >
            {link}
          </button>
        ))}
      </div>

      {/* Right side buttons */}
      <div className="flex items-center gap-2.5">
        <button 
          className="theme-toggle" 
          onClick={() => setDarkMode(!darkMode)}
          id="theme-btn" 
          title="Toggle theme"
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* Admin Login Button (Secure Lock Icon) */}
        <Link 
          to="/admin/login" 
          className="theme-toggle" 
          title="Admin Portal Login"
        >
          <FiLock size={15} />
        </Link>

        {/* Mobile menu trigger */}
        <button
          className="lg:hidden text-accent p-2 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-5 space-y-1.5">
            <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute top-[62px] left-0 right-0 lg:hidden bg-brand-bg border-b border-brand-border shadow-lg overflow-hidden z-[199]"
          >
            <div className="p-6 space-y-2 flex flex-col items-stretch">
              {links.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollTo(link)}
                  className="w-full text-left px-4 py-3 text-[16px] text-brand-gray hover:text-accent font-semibold rounded-xl hover:bg-accent/5 transition-all"
                >
                  {link}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
