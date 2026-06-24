import { useState, useEffect } from 'react';
import { getCertifications, resolveUrl } from '../../../api/services';
import { FiCloud, FiAward, FiBookOpen, FiCpu, FiBriefcase, FiFileText, FiEye, FiExternalLink } from 'react-icons/fi';

const getCertMeta = (orgName) => {
  if (!orgName) return { icon: <FiFileText size={16} />, bg: 'rgba(148,163,184,0.1)', color: 'var(--muted)', border: '1px solid rgba(148,163,184,0.25)' };
  const o = orgName.toLowerCase();
  if (o.includes('amazon') || o.includes('aws')) {
    return { icon: <FiCloud size={16} />, bg: 'rgba(253,186,116,0.15)', color: 'var(--peach)', border: '1px solid rgba(253,186,116,0.3)' };
  } else if (o.includes('nptel') || o.includes('swayam')) {
    return { icon: <FiAward size={16} />, bg: 'rgba(167,139,250,0.12)', color: 'var(--accent)', border: '1px solid rgba(167,139,250,0.25)' };
  } else if (o.includes('infosys')) {
    return { icon: <FiBookOpen size={16} />, bg: 'rgba(103,232,249,0.12)', color: 'var(--cyan)', border: '1px solid rgba(103,232,249,0.3)' };
  } else if (o.includes('nxtwave')) {
    return { icon: <FiCpu size={16} />, bg: 'rgba(249,168,212,0.12)', color: 'var(--pink)', border: '1px solid rgba(249,168,212,0.3)' };
  } else if (o.includes('linkedin')) {
    return { icon: <FiBriefcase size={16} />, bg: 'rgba(96,165,250,0.12)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.25)' };
  }
  return { icon: <FiFileText size={16} />, bg: 'rgba(148,163,184,0.1)', color: 'var(--muted)', border: '1px solid rgba(148,163,184,0.25)' };
};

export default function CertificationsSection({ certifications: initialCerts, onPreview }) {
  const [certs, setCerts] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (initialCerts) {
      setCerts(initialCerts);
    } else {
      // Fetch certs from Spring Boot backend (page size 100 for client search and filter)
      getCertifications({ page: 0, size: 100 })
        .then((res) => {
          if (res.data?.content) {
            setCerts(res.data.content);
          }
        })
        .catch(console.error);
    }
  }, [initialCerts]);

  const pageSize = 5;
  const totalFilteredPages = Math.ceil(certs.length / pageSize) || 1;
  const currentPage = Math.min(page, totalFilteredPages - 1);
  const activePage = currentPage >= 0 ? currentPage : 0;
  const paginatedData = certs.slice(activePage * pageSize, (activePage + 1) * pageSize);

  return (
    <section id="certifications" className="section alt py-20 px-6 md:px-20 relative z-10 transition-colors duration-500">
      <div className="eyebrow block text-[11px] font-bold uppercase tracking-[2.5px] text-accent mb-2">
        Certifications
      </div>
      <h2 className="sec-title font-display text-[clamp(26px,3vw,40px)] font-bold tracking-[-1px] text-text-main mb-10">
        Verified Credentials
      </h2>

      <div className="cert-list flex flex-col gap-3 select-text">
        {paginatedData.length === 0 ? (
          <div className="text-center py-10 text-brand-muted text-sm border border-dashed border-brand-border/40 rounded-2xl bg-brand-surface/20">
            No certifications uploaded yet.
          </div>
        ) : (
          paginatedData.map((cert) => {
          const meta = getCertMeta(cert.organization);
          const photoUrl = resolveUrl(cert.imageUrl);

          return (
            <div 
              key={cert.id} 
              className="cert-item"
              style={{ borderLeft: `4px solid ${meta.color}` }}
            >
              {/* Organization avatar symbol */}
              <div 
                className="cert-ico select-none flex items-center justify-center text-[18px]"
                style={{ background: meta.bg, color: meta.color, border: meta.border }}
              >
                {meta.icon}
              </div>

              {/* Detail body */}
              <div>
                <div className="cert-org font-bold text-[10px] text-brand-muted uppercase tracking-[0.5px] mb-0.5 select-none">
                  {cert.organization}
                </div>
                <div className="cert-title font-bold text-[14px] text-text-main leading-[1.3]">
                  {cert.title}
                </div>
                <div className="cert-date text-[11px] text-brand-muted select-none">
                  {cert.issueDate || '2024'}
                </div>
              </div>

              {/* Actions stack */}
              <div className="cert-acts select-none">
                {cert.certificateLink && (
                  <a 
                    href={cert.certificateLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="cbtn cbtn-a inline-flex items-center gap-1"
                  >
                    <FiExternalLink size={11} /> Open
                  </a>
                )}
                {cert.imageUrl && (
                  <button 
                    onClick={() => onPreview(photoUrl)}
                    className="cbtn cbtn-v inline-flex items-center gap-1"
                  >
                    <FiEye size={11} /> View
                  </button>
                )}
              </div>
            </div>
          );
        }))}
      </div>

      {/* Pagination Controls */}
      {totalFilteredPages > 1 && (
        <div className="pagination flex items-center justify-center gap-2 mt-8 select-none">
          <button 
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={activePage === 0}
            className="pg disabled:opacity-40"
          >
            ‹
          </button>
          
          {[...Array(totalFilteredPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`pg ${activePage === i ? 'on' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            onClick={() => setPage((p) => Math.min(totalFilteredPages - 1, p + 1))}
            disabled={activePage === totalFilteredPages - 1}
            className="pg disabled:opacity-40"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
