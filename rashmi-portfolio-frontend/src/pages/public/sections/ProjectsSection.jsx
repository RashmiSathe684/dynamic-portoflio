import { useState, useEffect } from 'react';
import { getProjects, resolveUrl, sortItemsByDate } from '../../../api/services';
import { FiSearch, FiGithub, FiExternalLink, FiEye } from 'react-icons/fi';

export default function ProjectsSection({ projects: initialProjects, onPreview }) {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialProjects) {
      setProjects(sortItemsByDate(initialProjects, 'createdDate'));
      setIsLoading(false);
    } else {
      setIsLoading(true);
      getProjects({ page: 0, size: 100 })
        .then((res) => {
          if (res.data?.content && res.data.content.length > 0) {
            setProjects(sortItemsByDate(res.data.content, 'createdDate'));
          }
        })
        .catch(console.error)
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [initialProjects]);

  // Filter projects by search query
  const filteredData = projects.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(term) ||
      (item.techStack || '').toLowerCase().includes(term) ||
      (item.shortDescription || '').toLowerCase().includes(term)
    );
  });

  // Calculate local client-side pagination
  const pageSize = 4;
  const totalFilteredPages = Math.ceil(filteredData.length / pageSize) || 1;
  const currentPage = Math.min(page, totalFilteredPages - 1);
  const activePage = currentPage >= 0 ? currentPage : 0;
  const paginatedData = filteredData.slice(activePage * pageSize, (activePage + 1) * pageSize);

  const ProjectsSkeleton = () => (
    <div className="proj-grid grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
      {[1, 2].map((n) => (
        <div key={n} className="pj border border-brand-border/40 rounded-3xl overflow-hidden bg-brand-surface/60 backdrop-blur-md flex flex-col h-[320px]">
          {/* Cover image skeleton */}
          <div className="skeleton w-full h-[140px] opacity-40" />
          {/* Card body skeleton */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="skeleton w-1/3 h-5 rounded-lg opacity-80" />
                <div className="skeleton w-1/4 h-3.5 rounded-lg opacity-60" />
              </div>
              <div className="skeleton w-full h-4 rounded-lg opacity-60" />
              <div className="skeleton w-5/6 h-4 rounded-lg opacity-60" />
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex gap-2">
                <div className="skeleton w-12 h-6 rounded-md opacity-75" />
                <div className="skeleton w-16 h-6 rounded-md opacity-75" />
                <div className="skeleton w-14 h-6 rounded-md opacity-75" />
              </div>
              <div className="flex gap-2.5">
                <div className="skeleton w-20 h-8 rounded-xl opacity-80" />
                <div className="skeleton w-24 h-8 rounded-xl opacity-80" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section 
      id="projects" 
      className="section py-24 px-6 md:px-20 max-w-6xl mx-auto relative z-10 transition-colors duration-500 select-text"
    >
      <div className="eyebrow block text-[11px] font-bold uppercase tracking-[2.5px] text-accent mb-2">
        Projects
      </div>
      <h2 className="sec-title font-display text-[clamp(26px,3vw,40px)] font-bold tracking-[-1px] text-text-main mb-6">
        Featured Works
      </h2>

      {/* Search Input */}
      <div className="proj-search flex items-center gap-2.5 bg-brand-surface border border-brand-border rounded-xl px-4 py-3 mb-8 select-none">
        <FiSearch size={16} className="text-brand-muted shrink-0" />
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

      {/* Grid or Skeleton Loader */}
      {isLoading ? (
        <ProjectsSkeleton />
      ) : (
        <div className="proj-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedData.length === 0 ? (
            <div className="md:col-span-2 text-center py-12 text-slate-400 font-medium select-none text-sm bg-white/5 border border-brand-border/60 rounded-3xl">
              {search ? "No projects matched your criteria." : "No projects uploaded yet."}
            </div>
          ) : (
            paginatedData.map((project) => {
              const photoUrl = project.imageUrl ? resolveUrl(project.imageUrl) : '';

              return (
                <div key={project.id} className="pj flex flex-col bg-brand-surface border border-brand-border/40 rounded-3xl overflow-hidden shadow-lg select-text h-full min-h-[320px]">
                  {/* Cover Image Container (140px height) */}
                  {photoUrl ? (
                    <div 
                      className="pj-img h-[140px] flex items-center justify-center relative overflow-hidden select-none bg-brand-bg border-b border-brand-border/40"
                    >
                      <img 
                        src={photoUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                      />
                      <div className="pj-img-label">Project Preview</div>
                    </div>
                  ) : (
                    // Aesthetic placeholder gradient if no image uploaded
                    <div className="h-[120px] bg-gradient-to-tr from-accent/10 to-cyan/10 border-b border-brand-border/45 flex items-center justify-center select-none font-display font-semibold text-brand-muted text-[13px] tracking-wide">
                      Dynamic Project Context
                    </div>
                  )}

                  {/* Body */}
                  <div className="pj-body p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="pj-top flex justify-between items-start gap-2.5 mb-2.5">
                        <h3 className="pj-title font-display text-[16.5px] font-bold text-text-main leading-[1.2]">
                          {project.title}
                        </h3>
                        <span className="pj-date text-[10px] font-bold text-brand-muted uppercase tracking-wider whitespace-nowrap bg-accent/8 border border-brand-border/50 px-2 py-0.5 rounded-md">
                          {project.createdDate || 'DEC 2025'}
                        </span>
                      </div>

                      <p className="pj-desc text-[13.5px] text-brand-gray leading-[1.65] mb-4">
                        {project.shortDescription}
                      </p>
                    </div>

                    <div>
                      <div className="pj-tags flex flex-wrap gap-1.5 mb-4.5 select-none">
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
                          <a href={project.githubLink} target="_blank" rel="noreferrer" className="pj-btn inline-flex items-center gap-1.5">
                            <FiGithub size={13} /> GitHub
                          </a>
                        )}
                        {project.liveLink && (
                          <a href={project.liveLink} target="_blank" rel="noreferrer" className="pj-btn live inline-flex items-center gap-1.5">
                            <FiExternalLink size={13} /> Live Demo
                          </a>
                        )}
                        {photoUrl && (
                          <button 
                            onClick={() => onPreview(photoUrl)}
                            className="pj-btn prev inline-flex items-center gap-1.5"
                          >
                            <FiEye size={13} /> Preview
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
      )}

      {/* Pagination Controls */}
      {!isLoading && totalFilteredPages > 1 && (
        <div className="pagination flex items-center justify-center gap-2 mt-10 select-none">
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
