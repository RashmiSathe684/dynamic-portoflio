import { useState, useEffect } from 'react';
import { getAchievements, resolveUrl } from '../../../api/services';
import { FiAward, FiEye } from 'react-icons/fi';

const fallbackAchievements = [
  {
    id: 'a1',
    title: 'Naukri Campus Young Turks 2025',
    description: "98.12 percentile · Certificate of Merit · Ranked #9589 (Round 1) and #7544 (Round 2) in Coding, Data Science & AI — India's largest national skill competition.",
    achievementDate: '2025-01-01',
    imageUrl: ''
  },
  {
    id: 'a2',
    title: 'TCS CodeVita Season 13 (2025)',
    description: 'Successfully qualified Round 1 of the global competitive programming contest by TCS — Zone 1.',
    achievementDate: '2025-02-01',
    imageUrl: ''
  },
  {
    id: 'a3',
    title: 'Flipkart GRiD 7.0 — Software Dev Track',
    description: 'Shortlisted in Flipkart Early Careers flagship challenge. Advanced to Coding Assessment Round with official recognition.',
    achievementDate: '2025-03-01',
    imageUrl: ''
  },
  {
    id: 'a4',
    title: 'MaTPO Programming Idol 2024',
    description: 'Advanced to Round 2 of the national-level competitive programming contest.',
    achievementDate: '2024-01-01',
    imageUrl: ''
  }
];

export default function AchievementsSection({ onPreview }) {
  const [achievements, setAchievements] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getAchievements({ page: 0, size: 100 })
      .then((res) => {
        if (res.data?.content) {
          setAchievements(res.data.content);
        }
      })
      .catch(console.error);
  }, []);

  const dataList = achievements.length > 0 ? achievements : fallbackAchievements;
  const pageSize = 4;
  const totalFilteredPages = Math.ceil(dataList.length / pageSize) || 1;
  const currentPage = Math.min(page, totalFilteredPages - 1);
  const activePage = currentPage >= 0 ? currentPage : 0;
  const paginatedData = dataList.slice(activePage * pageSize, (activePage + 1) * pageSize);

  return (
    <section id="achievements" className="section py-20 px-6 md:px-20 relative z-10 transition-colors duration-500">
      <div className="eyebrow block text-[11px] font-bold uppercase tracking-[2.5px] text-accent mb-2">
        Achievements
      </div>
      <h2 className="sec-title font-display text-[clamp(26px,3vw,40px)] font-bold tracking-[-1px] text-text-main mb-10">
        Milestones &amp; Recognitions
      </h2>

      <div className="flex flex-col gap-3.5 select-text">
        {paginatedData.map((ach) => {
          const year = ach.achievementDate 
            ? ach.achievementDate.split('-')[0] 
            : '2025';

          const urls = ach.imageUrl ? ach.imageUrl.split(',').filter(Boolean) : [];

          return (
            <div 
              key={ach.id} 
              className="ach-card-horiz flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left Column: Icon and Text */}
              <div className="flex items-center gap-4 flex-1">
                {/* Custom Trophy Icon Wrapper */}
                <div className="ach-icon-box w-11 h-11 rounded-[12px] flex items-center justify-center bg-accent/12 text-accent border border-brand-border/60 shrink-0 select-none">
                  <FiAward size={20} />
                </div>
                
                {/* Title & Description Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="ach-title font-display text-[15px] font-bold text-text-main truncate">
                      {ach.title}
                    </h3>
                    <span className="ach-yr text-[10px] font-bold px-2 py-0.5 bg-accent/12 text-accent rounded-md border border-brand-border/60 select-none">
                      {year}
                    </span>
                  </div>
                  <p className="ach-desc text-[13px] text-brand-gray leading-[1.6]">
                    {ach.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Dynamic Action Trigger */}
              <div className="shrink-0 flex items-center select-none gap-2">
                {urls.length === 1 && (
                  <button 
                    onClick={() => onPreview(resolveUrl(urls[0]))}
                    className="ach-view-btn-new inline-flex items-center gap-1.5"
                  >
                    <FiEye size={13} /> View Certificate
                  </button>
                )}
                {urls.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {urls.map((url, idx) => (
                      <button 
                        key={idx}
                        onClick={() => onPreview(resolveUrl(url))}
                        className="ach-view-btn-new inline-flex items-center gap-1.5"
                      >
                        <FiEye size={13} /> View Proof {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
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