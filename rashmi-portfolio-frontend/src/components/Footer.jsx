export default function Footer() {
  const scrollTo = (id) => {
    const element = document.getElementById(id.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-brand-bg border-t border-brand-border py-14 px-6 md:px-20 relative z-10 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-9 border-b border-brand-border mb-6">
          {/* Col 1 */}
          <div>
            <div className="footer-logo font-display font-bold text-[26px] mb-3 bg-clip-text text-transparent bg-gradient-to-r from-accent to-cyan select-none">
              RS.
            </div>
            <p className="footer-desc text-[13.5px] text-brand-gray leading-[1.75] max-w-[280px] mb-5">
              A passionate Full Stack Developer building clean and efficient digital solutions with Java, Spring Boot, and React.js.
            </p>
            <div className="footer-socials flex gap-2">
              <a href="https://github.com/RashmiSathe684" target="_blank" rel="noreferrer" className="fsoc font-bold">
                GH
              </a>
              <a href="https://linkedin.com/in/rashmisathe" target="_blank" rel="noreferrer" className="fsoc font-bold">
                in
              </a>
              <a href="https://leetcode.com/u/rashmi684" target="_blank" rel="noreferrer" className="fsoc font-bold">
                LC
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <div className="footer-col-title text-[13px] font-bold text-text-main mb-3.5 uppercase tracking-[0.5px]">
              Navigation
            </div>
            <div className="footer-links flex flex-col gap-[7px]">
              <button onClick={() => scrollTo('home')} className="text-left text-[13px] text-brand-gray hover:text-accent transition-colors">Home</button>
              <button onClick={() => scrollTo('about')} className="text-left text-[13px] text-brand-gray hover:text-accent transition-colors">About</button>
              <button onClick={() => scrollTo('skills')} className="text-left text-[13px] text-brand-gray hover:text-accent transition-colors">Skills</button>
              <button onClick={() => scrollTo('projects')} className="text-left text-[13px] text-brand-gray hover:text-accent transition-colors">Projects</button>
              <button onClick={() => scrollTo('achievements')} className="text-left text-[13px] text-brand-gray hover:text-accent transition-colors">Achievements</button>
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <div className="footer-col-title text-[13px] font-bold text-text-main mb-3.5 uppercase tracking-[0.5px]">
              More
            </div>
            <div className="footer-links flex flex-col gap-[7px]">
              <button onClick={() => scrollTo('certifications')} className="text-left text-[13px] text-brand-gray hover:text-accent transition-colors">Certifications</button>
              <button onClick={() => scrollTo('experience')} className="text-left text-[13px] text-brand-gray hover:text-accent transition-colors">Experience</button>
              <button onClick={() => scrollTo('education')} className="text-left text-[13px] text-brand-gray hover:text-accent transition-colors">Education</button>
              <button onClick={() => scrollTo('contact')} className="text-left text-[13px] text-brand-gray hover:text-accent transition-colors">Contact</button>

            </div>
          </div>
        </div>

        <div className="footer-bottom flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="footer-copy text-[12px] text-brand-muted">
            © 2026 · Solapur, Maharashtra
          </div>
          <div className="footer-made text-[12px] text-brand-muted uppercase">
            BUILT WITH <span className="text-accent font-semibold">SPRING BOOT</span> &amp; <span className="text-accent font-semibold">REACT.JS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
