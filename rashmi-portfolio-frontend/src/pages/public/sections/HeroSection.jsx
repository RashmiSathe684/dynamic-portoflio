import { useState, useEffect } from 'react';
import { getProfileSettings, resolveUrl } from '../../../api/services';

export default function HeroSection({ onPreview }) {
  const [profile, setProfile] = useState({ resumeUrl: '', profilePhotoUrl: '' });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    getProfileSettings()
      .then((res) => {
        if (res.data) setProfile(res.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setImageError(false);
  }, [profile.profilePhotoUrl]);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!profile.resumeUrl) return;

    try {
      const url = resolveUrl(profile.resumeUrl);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Smart filename extraction supporting both Cloudinary and local uploads
      let originalName = 'Rashmi_Sathe_Resume.pdf';
      if (profile.resumeUrl) {
        const lastSlash = profile.resumeUrl.lastIndexOf('/');
        const filename = lastSlash !== -1 ? profile.resumeUrl.substring(lastSlash + 1) : profile.resumeUrl;
        const underscoreIdx = filename.indexOf('_');
        originalName = underscoreIdx !== -1 ? filename.substring(underscoreIdx + 1) : filename;
      }
      
      link.setAttribute('download', originalName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
      window.open(resolveUrl(profile.resumeUrl), '_blank');
    }
  };

  const photoSrc = (!imageError && profile.profilePhotoUrl) ? resolveUrl(profile.profilePhotoUrl) : '';

  return (
    <section 
      id="home" 
      className="hero min-h-[calc(100vh-62px)] flex flex-col items-center justify-center text-center px-6 md:px-20 py-20 relative z-10 overflow-hidden transition-colors duration-500"
    >
      {/* Centered Subtle Background Gradient Blob */}
      <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none select-none">
        <div className="w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] bg-gradient-to-tr from-accent/15 to-cyan/15 rounded-full blur-[90px] animate-[pulse_6s_infinite]"></div>
      </div>

      {/* Content wrapper */}
      <div className="max-w-3xl mx-auto flex flex-col items-center select-text">
        {/* Centered Premium Profile Image Container */}
        <div 
          onClick={() => {
            if (photoSrc && onPreview) {
              onPreview(photoSrc);
            }
          }}
          className="mb-8 relative group select-none cursor-pointer"
          title="Click to zoom image"
        >
          {/* Subtle gradient outer glow outline */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent to-cyan rounded-full blur-[10px] opacity-45 group-hover:opacity-80 transition-all duration-300"></div>
          
          {/* Outer circle layout (Increased to 148px for perfect visual presence) */}
          <div className="w-[148px] h-[148px] rounded-full overflow-hidden border-[4px] border-brand-surface relative z-10 shadow-2xl bg-brand-surface flex items-center justify-center transition-transform duration-300 group-hover:scale-105 active:scale-95">
            {photoSrc ? (
              <img 
                src={photoSrc} 
                alt="Rashmi Sathe" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="text-[58px] select-none animate-[pulse_2s_infinite]">👩‍💻</div>
            )}
          </div>

          {/* Interactive Zoom Indicator Badge */}
          <div className="absolute bottom-1.5 right-1.5 bg-accent text-white w-7 h-7 rounded-full flex items-center justify-center border-2 border-brand-surface shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 text-[11px] font-bold">
            🔍
          </div>
        </div>

        {/* Eyebrow badge */}
        <div className="hero-eyebrow inline-flex items-center gap-2 bg-accent/12 border border-brand-border text-accent text-[12px] font-semibold px-4 py-1.5 rounded-[30px] mb-6 tracking-[0.5px] select-none">
          <div className="hero-dot w-1.5 h-1.5 bg-cyan rounded-full animate-[blink_1.5s_infinite]"></div>
          CS Student → Full Stack Developer
        </div>
        
        {/* Heading */}
        <h1 className="hero-h1 font-display text-[clamp(32px,5.5vw,56px)] font-bold leading-[1.1] tracking-[-2px] text-text-main mb-6">
          Full Stack Development<br />
          with <span className="grad bg-clip-text text-transparent bg-gradient-to-r from-accent to-cyan font-bold">Java &amp; React</span>
        </h1>
        
        {/* Subheading bio */}
        <p className="hero-bio text-[15.5px] sm:text-[17px] text-brand-gray leading-[1.8] max-w-2xl mb-10">
          Hi, I'm <strong>Rashmi Sathe</strong> — CS Engineering student at NKOCET, Solapur. Focused on full-stack development with a strong backend foundation in Java and Spring Boot, now building on the frontend with React.
        </p>
        
        {/* Exactly 3 buttons */}
        <div className="hero-actions flex gap-3.5 flex-wrap justify-center items-center select-none">
          <button 
            onClick={handleDownload}
            className="btn-glow inline-flex items-center gap-2 text-white border-none cursor-pointer"
          >
            ⬇ Download Resume
          </button>
          <a 
            href="https://github.com/RashmiSathe684" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-glass"
          >
            ⌥ GitHub
          </a>
          <a 
            href="https://linkedin.com/in/rashmisathe" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-glass"
          >
            in LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
