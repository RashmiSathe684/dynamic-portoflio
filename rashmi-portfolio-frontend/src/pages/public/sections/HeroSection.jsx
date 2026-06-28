import { useState, useEffect } from 'react';
import { getProfileSettings, resolveUrl } from '../../../api/services';
import { FiUser, FiSearch, FiEye, FiGithub, FiLinkedin } from 'react-icons/fi';

export default function HeroSection({ profile: initialProfile, onPreview }) {
  const [profile, setProfile] = useState({ resumeUrl: '', profilePhotoUrl: '' });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
    } else {
      getProfileSettings()
        .then((res) => {
          if (res.data) setProfile(res.data);
        })
        .catch(console.error);
    }
  }, [initialProfile]);

  useEffect(() => {
    setImageError(false);
  }, [profile.profilePhotoUrl]);

  const photoSrc = (!imageError && profile.profilePhotoUrl) ? resolveUrl(profile.profilePhotoUrl) : '';

  return (
    <section 
      id="home" 
      className="hero max-w-6xl mx-auto py-24 px-6 md:px-20 relative z-10 transition-colors duration-500"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none select-none">
        <div className="w-[380px] sm:w-[520px] h-[380px] sm:h-[520px] bg-gradient-to-tr from-accent/12 to-cyan/12 rounded-full blur-[100px] animate-[pulse_6s_infinite]"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side (Desktop) / Top (Mobile): Large Profile Photo (5 columns) with Double Frame & Floating Badges */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start select-none">
          <div className="relative group">
            {/* 3D Glowing Backdrop Layer */}
            <div className="photo-glow-backdrop"></div>
            
            {/* Floating Badge 1: Top-Left */}
            <div className="float-badge fb-tl animate-float-1 select-none flex items-center gap-1.5 border border-brand-border/85 bg-brand-surface/90 backdrop-blur-md">
              <span className="text-[12px] text-accent font-bold">★ B.Tech CSE</span>
            </div>
            
            {/* Floating Badge 2: Bottom-Right */}
            <div className="float-badge fb-br animate-float-2 select-none flex items-center gap-1.5 border border-brand-border/85 bg-brand-surface/90 backdrop-blur-md">
              <span className="text-[12px] text-accent font-bold">Java / React</span>
            </div>

            {/* Photo Card */}
            <div 
              onClick={() => {
                if (photoSrc && onPreview) {
                  onPreview(photoSrc);
                }
              }}
              className="hero-photo-card cursor-pointer group shadow-2xl relative overflow-hidden"
              title="Click to zoom image"
            >
              {photoSrc ? (
                <img 
                  src={photoSrc} 
                  alt="Rashmi Sathe" 
                  className="w-full h-full object-cover" 
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="hero-photo-placeholder">RS</div>
              )}
              
              {/* Overlay Indicator */}
              <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                <div className="bg-brand-surface text-accent p-3 rounded-full shadow-lg border border-brand-border">
                  <FiSearch size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Desktop) / Bottom (Mobile): Bio Details (7 columns) */}
        <div className="lg:col-span-7 text-left space-y-6 select-text">
          {/* Eyebrow Badge */}
          <div className="hero-eyebrow inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold px-4 py-1.5 rounded-full tracking-wider uppercase select-none">
            <div className="hero-dot w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
            Open to SDE Opportunities
          </div>
          
          {/* Main Title */}
          <h1 className="hero-h1 font-display text-[clamp(34px,5.2vw,54px)] font-bold leading-[1.1] tracking-[-2px] text-text-main">
            Hi, I'm <span className="grad bg-clip-text text-transparent bg-gradient-to-r from-accent to-cyan font-bold">Rashmi Sathe</span><br />
            Java Full Stack Developer
          </h1>
          
          {/* Punchy Bio Description */}
          <p className="hero-bio text-[15.5px] sm:text-[17px] text-brand-gray leading-[1.8] max-w-xl">
            I am an enthusiastic Computer Science student and an aspiring Software Engineer. With a solid foundation in Java, Spring Boot, React, and SQL, I love building end-to-end applications and solving programming challenges. Eager to launch my career, learn from senior developers, and contribute to real-world codebases.
          </p>
          
          {/* Actions CTA buttons */}
          <div className="hero-actions flex gap-4 flex-wrap items-center select-none pt-2">
            <a 
              href={profile.resumeUrl ? resolveUrl(profile.resumeUrl) : '#'}
              target="_blank"
              rel="noreferrer"
              className="btn-glow inline-flex items-center gap-2 text-white border-none cursor-pointer"
              onClick={(e) => {
                if (!profile.resumeUrl) {
                  e.preventDefault();
                  alert('No resume uploaded yet.');
                }
              }}
            >
              <FiEye size={15} /> View Resume
            </a>
            <a 
              href="https://github.com/RashmiSathe684" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-glass inline-flex items-center gap-2"
            >
              <FiGithub size={15} /> GitHub
            </a>
            <a 
              href="https://linkedin.com/in/rashmisathe" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-glass inline-flex items-center gap-2"
            >
              <FiLinkedin size={15} /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
