import { useState, useEffect } from 'react';
import { getInternships, resolveUrl, sortItemsByDate } from '../../../api/services';
import { FiCalendar, FiExternalLink, FiEye } from 'react-icons/fi';

const fallbackInternship = [
  {
    id: 'i1',
    title: 'Backend Development Intern',
    company: 'CodeAlpha',
    location: 'Remote',
    duration: '3 Months (May 26 – Jun 26)',
    description: 'Designed, developed, and tested robust backend RESTful APIs using Spring Boot, JPA, and PostgreSQL. Optimised schema design, implemented custom repository queries, integrated BCrypt authentication, and created automated test scenarios resulting in a 40% reduction in API response latency.',
    certificateUrl: ''
  }
];

export default function InternshipSection({ onPreview }) {
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    getInternships()
      .then((res) => {
        if (res.data) setInternships(sortItemsByDate(res.data, 'duration'));
      })
      .catch(console.error);
  }, []);

  const dataList = internships.length > 0 ? internships : fallbackInternship;

  return (
    <section id="experience" className="section py-20 px-6 md:px-20 relative z-10 transition-colors duration-500">
      <div className="eyebrow block text-[11px] font-bold uppercase tracking-[2.5px] text-accent mb-2">
        Experience
      </div>
      <h2 className="sec-title font-display text-[clamp(26px,3vw,40px)] font-bold tracking-[-1px] text-text-main mb-10">
        Internships &amp; Work Experience
      </h2>

      <div className="flex flex-col gap-4">
        {dataList.map((intern) => {
          const docUrl = resolveUrl(intern.downloadUrl);
          const hasLinks = intern.certificateUrl || intern.downloadUrl;

          return (
            <div key={intern.id} className="intern-card select-text">
              {/* Vertical Gradient Stripe */}
              <div className="intern-stripe select-none"></div>

              {/* Detail Inner Box */}
              <div className="intern-inner">
                <div className="intern-top flex flex-col sm:flex-row justify-between items-start gap-2.5 mb-1.5 select-none">
                  <h3 className="intern-title font-display text-[18px] font-bold text-text-main leading-snug">
                    {intern.title}
                  </h3>
                  <span className="intern-dur text-[12px] font-semibold px-3 py-1 bg-accent/12 text-accent border border-brand-border rounded-[9px] whitespace-nowrap inline-flex items-center gap-1.5">
                    <FiCalendar size={13} /> {intern.duration}
                  </span>
                </div>

                <div className="intern-org text-[13px] text-accent font-semibold mb-3">
                  {intern.company} · {intern.location || 'Remote'}
                </div>

                <p className="intern-desc text-[14px] text-brand-gray leading-[1.75] mb-4">
                  {intern.description}
                </p>

                {/* Offer Letter / Certification row */}
                {hasLinks && (
                  <div className="intern-cert-row flex flex-wrap items-center gap-2 select-none">
                    <span className="intern-lbl text-[12px] text-brand-muted font-semibold mr-1">
                      Certification &amp; Verification:
                    </span>
                    
                    {intern.certificateUrl && (
                      <a 
                        href={intern.certificateUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="cbtn cbtn-a inline-flex items-center gap-1"
                      >
                        <FiExternalLink size={11} /> View Certificate
                      </a>
                    )}

                    {intern.downloadUrl && (
                      <button 
                        onClick={() => onPreview(docUrl)}
                        className="cbtn cbtn-v inline-flex items-center gap-1"
                      >
                        <FiEye size={11} /> View Document
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
