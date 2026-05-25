export default function AboutSection() {
  return (
    <section id="about" className="section alt py-20 px-6 md:px-20 relative z-10 transition-colors duration-500">
      <div className="eyebrow block text-[11px] font-bold uppercase tracking-[2.5px] text-accent mb-2">
        About Me
      </div>
      <h2 className="sec-title font-display text-[clamp(26px,3vw,40px)] font-bold tracking-[-1px] text-text-main mb-10">
        My Story &amp; Tech Journey
      </h2>

      <div className="about-grid grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column Glass Card with Bio & Contacts */}
        <div className="glass-card flex flex-col gap-5">
          <div className="about-text text-[14.5px] text-brand-gray leading-[1.82] select-text">
            <p className="mb-4">
              CS student at NKOCET, Solapur — focused on full stack development with a strong backend foundation in Java and Spring Boot, now building on the frontend with React. I learned backend deeply before touching React — it's already helping me understand how frontend and backend connect in real applications.
            </p>
            <p className="mb-4">
              Outside of building, I enjoy solving DSA problems — there's something about reading a problem statement that makes me want to figure it out immediately.
            </p>
            <p>
              Looking for internship or fresher opportunities in full stack development where I can contribute to real projects on both sides of the stack.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <div className="info-chip">
              <div className="chip-ico">✉</div>
              <div>
                <div className="chip-lbl">Email</div>
                <div className="chip-val select-all">rashmisathe684@gmail.com</div>
              </div>
            </div>
            
            <div className="info-chip">
              <div className="chip-ico">📍</div>
              <div>
                <div className="chip-lbl">Location</div>
                <div className="chip-val">Solapur, Maharashtra, India</div>
              </div>
            </div>

            <div className="info-chip">
              <div className="chip-ico">📞</div>
              <div>
                <div className="chip-lbl">Phone</div>
                <div className="chip-val select-all">+91-7499574704</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column simple status info rows */}
        <div className="glass-card flex flex-col gap-5 select-text">
          <div className="info-row border-b border-brand-border/60 pb-4">
            <div className="text-[11px] font-bold text-accent uppercase tracking-wider mb-1">
              Currently Learning
            </div>
            <div className="text-[15px] font-bold text-text-main">
              React.js + Spring Boot
            </div>
          </div>

          <div className="info-row border-b border-brand-border/60 pb-4">
            <div className="text-[11px] font-bold text-cyan uppercase tracking-wider mb-1">
              Focus Area
            </div>
            <div className="text-[15px] font-bold text-text-main">
              Full Stack Java + React
            </div>
          </div>

          <div className="info-row pb-1">
            <div className="text-[11px] font-bold text-pink uppercase tracking-wider mb-1">
              Open To
            </div>
            <div className="text-[15px] font-bold text-text-main">
              Internships &amp; Fresher Roles
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
