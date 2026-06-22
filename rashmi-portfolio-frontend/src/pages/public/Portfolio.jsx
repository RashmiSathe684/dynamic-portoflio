import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import AchievementsSection from './sections/AchievementsSection';
import CertificationsSection from './sections/CertificationsSection';
import InternshipSection from './sections/InternshipSection';
import EducationSection from './sections/EducationSection';
import ContactSection from './sections/ContactSection';
import { getPortfolioDetails } from '../../api/services';
import fallbackPortfolioData from '../../data/portfolio-static.json';

export default function Portfolio() {
  const [previewImage, setPreviewImage] = useState(null);
  const [portfolioData, setPortfolioData] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_data');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      console.error("Failed to load cached portfolio details:", err);
    }
    return fallbackPortfolioData;
  });
  const [isLoading, setIsLoading] = useState(!portfolioData);

  useEffect(() => {
    getPortfolioDetails()
      .then((res) => {
        if (res.data) {
          setPortfolioData(res.data);
          localStorage.setItem('portfolio_data', JSON.stringify(res.data));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch portfolio details:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setPreviewImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg relative transition-colors duration-500">
      {/* Global Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <Navbar />
      
      <main className="relative z-10 max-w-7xl mx-auto">
        <HeroSection profile={portfolioData?.profile} onPreview={setPreviewImage} />
        <div className="w-full h-[1px] bg-brand-border/40 max-w-6xl mx-auto opacity-50"></div>
        
        <AboutSection />
        <div className="w-full h-[1px] bg-brand-border/40 max-w-6xl mx-auto opacity-50"></div>
        
        <SkillsSection skills={portfolioData?.skills} />
        <div className="w-full h-[1px] bg-brand-border/40 max-w-6xl mx-auto opacity-50"></div>
        
        <ProjectsSection projects={portfolioData?.projects} onPreview={setPreviewImage} />
        <div className="w-full h-[1px] bg-brand-border/40 max-w-6xl mx-auto opacity-50"></div>
        
        <AchievementsSection achievements={portfolioData?.achievements} onPreview={setPreviewImage} />
        <div className="w-full h-[1px] bg-brand-border/40 max-w-6xl mx-auto opacity-50"></div>
        
        <CertificationsSection certifications={portfolioData?.certifications} onPreview={setPreviewImage} />
        <div className="w-full h-[1px] bg-brand-border/40 max-w-6xl mx-auto opacity-50"></div>
        
        <InternshipSection internships={portfolioData?.internships} onPreview={setPreviewImage} />
        <div className="w-full h-[1px] bg-brand-border/40 max-w-6xl mx-auto opacity-50"></div>
        
        <EducationSection education={portfolioData?.education} />
        <div className="w-full h-[1px] bg-brand-border/40 max-w-6xl mx-auto opacity-50"></div>
        
        <ContactSection />
      </main>

      <div className="w-full h-[1px] bg-brand-border/60 max-w-7xl mx-auto opacity-60"></div>
      <Footer />

      {/* Global Modal Overlay */}
      <div 
        className={`modal-overlay ${previewImage ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target.classList.contains('modal-overlay')) {
            setPreviewImage(null);
          }
        }}
      >
        <div className="modal-preview">
          <button 
            className="modal-close" 
            onClick={() => setPreviewImage(null)}
          >
            ✕
          </button>
          {previewImage && (
            (previewImage.toLowerCase().endsWith('.pdf') || previewImage.toLowerCase().includes('.pdf?')) ? (
              <iframe 
                src={previewImage} 
                className="w-full h-[70vh] rounded-xl border-none mt-2 bg-white" 
                title="Document Preview"
              />
            ) : (
              <img src={previewImage} alt="Document Preview" />
            )
          )}
        </div>
      </div>
    </div>
  );
}