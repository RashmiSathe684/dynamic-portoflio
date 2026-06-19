import { FiMail, FiMapPin, FiPhone, FiCpu, FiBookOpen, FiLayout } from 'react-icons/fi';

export default function AboutSection() {
  return (
    <section 
      id="about" 
      className="section py-24 px-6 md:px-20 max-w-6xl mx-auto relative z-10 transition-colors duration-500 select-text"
    >
      <div className="eyebrow block text-[11px] font-bold uppercase tracking-[2.5px] text-accent mb-2">
        About Me
      </div>
      <h2 className="sec-title font-display text-[clamp(26px,3vw,40px)] font-bold tracking-[-1px] text-text-main mb-12">
        From Curiosity to Full Stack Development
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Bio Text & Unified Contacts (7 columns) */}
        <div className="lg:col-span-7">
          <div className="glass-card p-8 flex flex-col justify-between h-full">
            <div className="about-text text-[14.5px] sm:text-[15px] text-brand-gray leading-[1.8] space-y-5">
              <p>
                I am a Computer Science Engineering student passionate about starting my professional journey as a Software Developer. My path into programming began with curiosity about how applications function behind the scenes, leading me to dive deep into Java Full Stack development. Through internships, competitive programming, and structured training at Kiran Academy, I've built a strong foundation in core Java, Spring Boot, React, and SQL.
              </p>
              <p>
                I enjoy translating logical concepts into working applications, often drawing inspiration from everyday challenges—like developing a Campus Attendance System or a WFH Task Manager. I am actively seeking entry-level Software Engineer or Java Developer opportunities where I can apply my skills, learn from senior developers, and contribute to real-world codebases.
              </p>
            </div>

            {/* Redesigned Quick Contacts Bar */}
            <div className="quick-contacts-bar select-none">
              <div className="qc-item">
                <div className="qc-icon"><FiMail /></div>
                <a href="mailto:rashmisathe684@gmail.com" className="text-text-main font-bold">
                  rashmisathe684@gmail.com
                </a>
              </div>
              
              <div className="qc-divider"></div>
              
              <div className="qc-item">
                <div className="qc-icon"><FiMapPin /></div>
                <span className="text-text-main font-bold">Solapur, Maharashtra</span>
              </div>
              
              <div className="qc-divider"></div>
              
              <div className="qc-item">
                <div className="qc-icon"><FiPhone /></div>
                <a href="tel:+917499574704" className="text-text-main font-bold">
                  +91-7499574704
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fresher Milestones (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="text-[11px] font-bold text-accent uppercase tracking-[2px] mb-1 select-none">
            Highlights &amp; Focus
          </div>
          
          {/* Card 1: Education & Training */}
          <div className="glass-card p-5 flex items-start gap-4 border-l-4 border-l-accent hover:border-accent/40 transition-all duration-300 hover:translate-x-1 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-accent/8 text-accent flex items-center justify-center shrink-0 select-none">
              <FiBookOpen size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[14.5px] text-text-main">Education &amp; Training</h4>
              <p className="text-[12.5px] text-brand-gray leading-relaxed">
                B.Tech in Computer Science with a strong 8.31 CGPA, and completed extensive industry-ready Java Full Stack training at Kiran Academy.
              </p>
            </div>
          </div>

          {/* Card 2: Problem Solving & DSA */}
          <div className="glass-card p-5 flex items-start gap-4 border-l-4 border-l-cyan hover:border-cyan/40 transition-all duration-300 hover:translate-x-1 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan/8 text-cyan flex items-center justify-center shrink-0 select-none">
              <FiCpu size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[14.5px] text-text-main">Problem Solving (DSA)</h4>
              <p className="text-[12.5px] text-brand-gray leading-relaxed">
                Active on competitive coding platforms, focusing on core programming logic, algorithms, and data structure fundamentals in Java.
              </p>
            </div>
          </div>

          {/* Card 3: End-to-End Projects */}
          <div className="glass-card p-5 flex items-start gap-4 border-l-4 border-l-pink hover:border-pink/40 transition-all duration-300 hover:translate-x-1 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-pink/8 text-pink flex items-center justify-center shrink-0 select-none">
              <FiLayout size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[14.5px] text-text-main">Building End-to-End Apps</h4>
              <p className="text-[12.5px] text-brand-gray leading-relaxed">
                Designing database schemas, writing Spring Boot REST endpoints, and integrating React UI inputs into single-page user flows.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
