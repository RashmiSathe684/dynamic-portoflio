import { useState, useEffect } from 'react';
import { getSkills } from '../../../api/services';
import { FiCode, FiLayout, FiCpu, FiDatabase, FiTool, FiBookOpen } from 'react-icons/fi';

const categoryConfig = {
  LANGUAGES: { 
    label: 'Languages', 
    icon: <FiCode size={16} />, 
    bg: 'var(--pill-bg-indigo)', 
    pillClass: '',
    borderColor: 'var(--pill-tx-indigo)'
  },
  FRONTEND: { 
    label: 'Frontend', 
    icon: <FiLayout size={16} />, 
    bg: 'var(--pill-bg-cyan)', 
    pillClass: 'g',
    borderColor: 'var(--pill-tx-cyan)'
  },
  BACKEND: { 
    label: 'Backend', 
    icon: <FiCpu size={16} />, 
    bg: 'var(--pill-bg-orange)', 
    pillClass: 'o',
    borderColor: 'var(--pill-tx-orange)'
  },
  DATABASES: { 
    label: 'Databases', 
    icon: <FiDatabase size={16} />, 
    bg: 'var(--pill-bg-blue)', 
    pillClass: 'b',
    borderColor: 'var(--pill-tx-blue)'
  },
  TOOLS: { 
    label: 'Tools & Development', 
    icon: <FiTool size={16} />, 
    bg: 'var(--pill-bg-pink)', 
    pillClass: 'p',
    borderColor: 'var(--pill-tx-pink)'
  },
  CORE: { 
    label: 'Core Concepts', 
    icon: <FiBookOpen size={16} />, 
    bg: 'var(--pill-bg-slate)', 
    pillClass: 's',
    borderColor: 'var(--pill-tx-slate)'
  }
};

const fallbackData = {
  LANGUAGES: ['Java', 'Python', 'C', 'SQL'],
  FRONTEND: ['HTML', 'CSS', 'JavaScript', 'React JS'],
  BACKEND: ['J2EE', 'Spring Boot', 'REST APIs', 'Hibernate', 'JPA', 'JDBC'],
  DATABASES: ['PostgreSQL', 'MySQL', 'Oracle', 'Firebase'],
  TOOLS: ['Git & GitHub', 'Postman', 'Maven', 'VS Code', 'Eclipse IDE'],
  CORE: ['DSA', 'OOPs', 'DBMS', 'OS', 'CN']
};

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    getSkills()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setSkills(res.data);
        }
      })
      .catch(console.error);
  }, []);

  const groupedSkills = skills.reduce((acc, skill) => {
    const name = skill.name ? skill.name.trim() : '';
    const nameLower = name.toLowerCase();
    if (nameLower === 'microservices' || nameLower === 'cloud' || nameLower === 'system design') {
      return acc;
    }
    const cat = skill.category ? skill.category.toUpperCase() : 'CORE';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(name);
    return acc;
  }, {});

  const categories = ['LANGUAGES', 'FRONTEND', 'BACKEND', 'DATABASES', 'TOOLS', 'CORE'];

  return (
    <section id="skills" className="section py-20 px-6 md:px-20 relative z-10 transition-colors duration-500">
      <div className="eyebrow block text-[11px] font-bold uppercase tracking-[2.5px] text-accent mb-2 select-none">
        Technical Skills
      </div>
      <h2 className="sec-title font-display text-[clamp(26px,3vw,40px)] font-bold tracking-[-1px] text-text-main mb-2">
        Tech Stack &amp; Expertise
      </h2>
      <p className="sec-sub text-[14px] text-brand-muted mb-6 max-w-[520px] select-none">
        Technologies, tools, and core concepts I use to build robust full-stack applications.
      </p>

      <div className="skills-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((catKey) => {
          const config = categoryConfig[catKey] || categoryConfig.CORE;
          const skillList = (groupedSkills[catKey] && groupedSkills[catKey].length > 0)
            ? groupedSkills[catKey]
            : (fallbackData[catKey] || []);

          return (
            <div 
              key={catKey} 
              className="sk-card flex flex-col justify-start select-none"
              style={{ borderLeft: `3px solid ${config.borderColor}` }}
            >
              <div className="sk-head flex items-center gap-2.5 mb-3.5">
                <div 
                  className="sk-ico w-9 h-9 rounded-[11px] flex items-center justify-center text-[18px]"
                  style={{ background: config.bg, color: config.borderColor }}
                >
                  {config.icon}
                </div>
                <span className="sk-cat font-display text-[13px] font-bold text-text-main uppercase tracking-[0.5px]">
                  {config.label}
                </span>
              </div>

              <div className="sk-pills flex flex-wrap gap-1.5">
                {skillList.map((skill) => (
                  <span 
                    key={skill} 
                    className={`pill ${config.pillClass}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
