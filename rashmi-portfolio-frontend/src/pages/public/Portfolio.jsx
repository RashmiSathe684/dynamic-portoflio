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
import { 
  getPortfolioDetails,
  getProfileSettings,
  getSkills,
  getProjects,
  getAchievements,
  getCertifications,
  getInternships,
  getEducation
} from '../../api/services';

export default function Portfolio() {
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);
  const [portfolioData, setPortfolioData] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_data');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      console.error("Failed to load cached portfolio details:", err);
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(!portfolioData);

  useEffect(() => {
    setError(null);

    const fetchIndividualDetails = () => {
      return Promise.all([
        getProfileSettings(),
        getSkills(),
        getProjects({ page: 0, size: 100 }),
        getAchievements({ page: 0, size: 100 }),
        getCertifications({ page: 0, size: 100 }),
        getInternships(),
        getEducation()
      ]).then(([profileRes, skillsRes, projectsRes, achievementsRes, certificationsRes, internshipsRes, educationRes]) => {
        return {
          data: {
            profile: profileRes.data,
            skills: skillsRes.data,
            projects: projectsRes.data?.content || [],
            achievements: achievementsRes.data?.content || [],
            certifications: certificationsRes.data?.content || [],
            internships: internshipsRes.data || [],
            education: educationRes.data || []
          }
        };
      });
    };

    fetchIndividualDetails()
      .then((res) => {
        if (res.data) {
          setPortfolioData(res.data);
          localStorage.setItem('portfolio_data', JSON.stringify(res.data));
        } else {
          setError("No portfolio data returned from backend.");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch portfolio details:", err);
        setError("Could not connect to the backend server.");
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

  if (isLoading && !portfolioData) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center relative overflow-hidden">
        {/* Global Background Blobs */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-6 select-none">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-brand-border opacity-20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-accent border-r-cyan animate-spin"></div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="font-display text-xl font-bold text-text-main animate-pulse">
              Loading Portfolio...
            </h2>
            <p className="text-sm text-brand-muted">Fetching latest details from backend</p>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolioData && error) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Global Background Blobs */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        
        <div className="relative z-10 max-w-md w-full glass-card p-8 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-coral/10 text-coral flex items-center justify-center text-2xl font-bold select-none">
            ⚠
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-text-main">
              Connection Error
            </h2>
            <p className="text-sm text-brand-gray leading-relaxed">
              {error} Please make sure the Spring Boot backend server is running and try again.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="btn-glow w-full flex items-center justify-center cursor-pointer select-none"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

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