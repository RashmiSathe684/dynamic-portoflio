import { useState, useEffect } from 'react';
import { getProjects, resolveUrl, sortItemsByDate } from '../../../api/services';
export default function ProjectsSection({ onPreview }) {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    // Fetch all projects or paginated projects from backend
    getProjects({ page: 0, size: 100 })
      .then((res) => {
        if (res.data?.content) {
          setProjects(sortItemsByDate(res.data.content, 'createdDate'));
        }
      })
      .catch(console.error);
  }, []);

  const dataList = projects;

  // Filter projects by search query
  const filteredData = dataList.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(term) ||
      (item.techStack || '').toLowerCase().includes(term) ||
      (item.shortDescription || '').toLowerCase().includes(term)
    );
  });

  // Calculate local client-side pagination
  const pageSize = 2;
  const totalFilteredPages = Math.ceil(filteredData.length / pageSize) || 1;
  const currentPage = Math.min(page, totalFilteredPages - 1);
  const activePage = currentPage >= 0 ? currentPage : 0;
  const paginatedData = filteredData.slice(activePage * pageSize, (activePage + 1) * pageSize);

  const defaultGradient = 'linear-gradient(135deg, rgba(159,168,255,0.15) 0%, rgba(103,232,249,0.1) 100%)';

  return (
    <section id="projects" className="section alt py-20 px-6 md:px-20 relative z-10 transition-colors duration-500">
      <div className="eyebrow block text-[11px] font-bold uppercase tracking-[2.5px] text-accent mb-2">
        Projects
      </div>
      <h2 className="sec-title font-display text-[clamp(26px,3vw,40px)] font-bold tracking-[-1px] text-text-main mb-6">
        Featured Works
      </h2>

      {/* Search Input */}
      <div className="proj-search flex items-center gap-2.5 bg-brand-surface border border-brand-border rounded-xl px-4 py-3 mb-6 select-none">
        <span style={{ color: 'var(--muted)', fontSize: '16px' }}>🔍</span>
        <input 
          type="text" 
          placeholder="Search projects or tech stack..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0); // Reset page on filter
          }}
          className="flex-1 border-none bg-transparent outline-none font-sans text-[14px] text-brand-gray placeholder-brand-muted"
        />
      </div>

      {/* Projects Grid */}
      <div className="proj-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedData.length === 0 ? (
          <div className="md:col-span-2 text-center py-12 text-slate-400 font-medium select-none text-sm bg-white/5 border border-brand-border/60 rounded-3xl">
            No projects added yet. Please check back later!
          </div>
        ) : (
          paginatedData.map((project) => {
            const photoUrl = resolveUrl(project.imageUrl);

          return (
            <div key={project.id} className="pj flex flex-col select-text">
              {/* Cover Image Container (160px height) */}
              {project.imageUrl && (
                <div 
                  className="pj-img h-[160px] flex items-center justify-center relative overflow-hidden select-none"
                  style={{ background: 'var(--border)' }}
                >
                  <img 
                    src={photoUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="pj-img-label">Preview Image</div>
                </div>
              )}

              {/* Body */}
              <div className="pj-body p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="pj-top flex justify-between items-start gap-2 mb-2">
                    <h3 className="pj-title font-display text-[16px] font-bold text-text-main leading-[1.2]">
                      {project.title}
                    </h3>
                    <span className="pj-date text-[11px] text-brand-muted uppercase tracking-wider whitespace-nowrap">
                      {project.createdDate || 'DEC 2025'}
                    </span>
                  </div>

                  <p className="pj-desc text-[13px] text-brand-gray leading-[1.65] mb-3.5">
                    {project.shortDescription}
                  </p>
                </div>

                <div>
                  <div className="pj-tags flex flex-wrap gap-1.5 mb-4 select-none">
                    {(project.techStack || '').split(',')
                      .map((tech) => tech.trim())
                      .filter(Boolean)
                      .map((tech) => (
                        <span key={tech} className="pj-tag">
                          {tech}
                        </span>
                      ))}
                  </div>

                  {/* Actions */}
                  <div className="pj-actions flex gap-2 select-none">
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" className="pj-btn">
                        ⌥ GitHub
                      </a>
                    )}
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noreferrer" className="pj-btn live">
                        ↗ Live Demo
                      </a>
                    )}
                    {project.imageUrl && (
                      <button 
                        onClick={() => onPreview(photoUrl)}
                        className="pj-btn prev"
                      >
                        🖼 Preview
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
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
