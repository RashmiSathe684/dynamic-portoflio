import { useState, useEffect } from 'react';
import { getEducation } from '../../../api/services';
import { FiBook, FiBookOpen, FiAward } from 'react-icons/fi';

const fallbackEducation = [
  { 
    id: 'e1',
    degree: 'B.Tech in Computer Science and Engineering', 
    institution: 'N.K. Orchid College of Engineering & Technology, Solapur', 
    score: '8.31', 
    duration: '2023 – 2026', 
    iconType: 'GRAD' 
  },
  { 
    id: 'e2',
    degree: 'Diploma in Computer Technology', 
    institution: 'Government Polytechnic, Solapur', 
    score: '87.89%', 
    duration: '2020 – 2023', 
    iconType: 'BOOK' 
  },
  { 
    id: 'e3',
    degree: 'Class X (CBSE Board)', 
    institution: 'Kendriya Vidyalaya, Solapur', 
    score: '84.6%', 
    duration: '2019 – 2020', 
    iconType: 'SCHOOL' 
  }
];

const getEduIcon = (type) => {
  switch (type ? type.toUpperCase() : 'DEFAULT') {
    case 'GRAD':
      return <FiAward size={16} />;
    case 'BOOK':
      return <FiBook size={16} />;
    case 'SCHOOL':
      return <FiBookOpen size={16} />;
    default:
      return <FiAward size={16} />;
  }
};

const getEduIconStyle = (type) => {
  switch (type ? type.toUpperCase() : 'DEFAULT') {
    case 'GRAD':
      return { 
        background: 'rgba(159, 168, 255, 0.15)', 
        color: 'var(--accent)', 
        border: '1px solid rgba(159, 168, 255, 0.3)' 
      };
    case 'BOOK':
      return { 
        background: 'rgba(103, 232, 249, 0.15)', 
        color: 'var(--cyan)', 
        border: '1px solid rgba(103, 232, 249, 0.3)' 
      };
    case 'SCHOOL':
      return { 
        background: 'rgba(249, 168, 212, 0.15)', 
        color: 'var(--pink)', 
        border: '1px solid rgba(249, 168, 212, 0.3)' 
      };
    default:
      return { 
        background: 'var(--accent-bg)', 
        color: 'var(--accent)', 
        border: '1px solid var(--border)' 
      };
  }
};

export default function EducationSection({ education: initialEducation }) {
  const [education, setEducation] = useState([]);

  useEffect(() => {
    if (initialEducation) {
      setEducation(initialEducation);
    } else {
      getEducation()
        .then((res) => {
          if (res.data) setEducation(res.data);
        })
        .catch(console.error);
    }
  }, [initialEducation]);

  const dataList = education.length > 0 ? education : fallbackEducation;

  return (
    <section id="education" className="section alt py-20 px-6 md:px-20 relative z-10 transition-colors duration-500">
      <div className="eyebrow block text-[11px] font-bold uppercase tracking-[2.5px] text-accent mb-2">
        Education
      </div>
      <h2 className="sec-title font-display text-[clamp(26px,3vw,40px)] font-bold tracking-[-1px] text-text-main mb-10">
        Academic Journey
      </h2>

      {/* Wrapped in a single beautiful glass card */}
      <div className="glass-card flex flex-col gap-0 select-text">
        {dataList.map((edu, i) => {
          const icon = getEduIcon(edu.iconType);
          const iconStyle = getEduIconStyle(edu.iconType);
          const scoreStr = edu.score || '';
          const displayScore = scoreStr ? (scoreStr.includes('%') || scoreStr.toLowerCase().includes('cgpa') ? scoreStr : `${scoreStr} CGPA`) : '';

          return (
            <div key={edu.id || i} className="edu-row">
              {/* Distinct colored icon avatar */}
              <div 
                className="edu-ico select-none flex items-center justify-center"
                style={iconStyle}
              >
                {icon}
              </div>

              {/* Title & Organization info */}
              <div className="flex-1 min-w-0">
                <h3 className="edu-deg font-display text-[15px] font-bold text-text-main truncate">
                  {edu.degree}
                </h3>
                <div className="edu-col text-[13px] text-brand-muted mt-0.5 truncate">
                  {edu.institution}
                </div>
              </div>

              {/* Score & Duration */}
              <div className="select-none flex flex-col items-end gap-1.5 shrink-0">
                {displayScore && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-accent/8 border border-brand-border/60 text-accent tracking-wide whitespace-nowrap">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-[pulse_2s_infinite]"></span>
                    {displayScore}
                  </div>
                )}
                <div className="edu-yr text-[11.5px] text-brand-muted text-right whitespace-nowrap">
                  {edu.duration}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}