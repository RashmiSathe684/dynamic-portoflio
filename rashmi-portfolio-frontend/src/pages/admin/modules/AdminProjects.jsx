import { useState, useEffect, useCallback, useRef } from 'react';
import { getProjects, createProject, updateProject, deleteProject, uploadProjectImage, sortItemsByDate } from '../../../api/services';
import CustomAlert from '../../../components/CustomAlert';
import { FaPlus, FaTrash, FaEdit, FaGithub, FaLink } from 'react-icons/fa';

const EMPTY = {
  title: '', shortDescription: '', detailedDescription: '',
  techStack: '', githubLink: '', liveLink: '', imageUrl: '', createdDate: ''
};

export default function AdminProjects() {
  const formRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [imageUploading, setImageUploading] = useState(false);
  const [alert, setAlert] = useState(null);

  const load = useCallback(() => {
    getProjects({ page, size: 8 }).then((res) => {
      setProjects(sortItemsByDate(res.data.content, 'createdDate'));
      setTotalPages(res.data.totalPages);
    });
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const res = await uploadProjectImage(file);
      setForm((f) => ({ ...f, imageUrl: res.data }));
      setAlert({ message: 'Image uploaded successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setAlert({ message: 'Image upload failed.', type: 'error' });
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await updateProject(editId, form);
        setAlert({ message: 'Project updated successfully!', type: 'success' });
      } else {
        await createProject(form);
        setAlert({ message: 'Project created successfully!', type: 'success' });
      }
      resetForm();
      load();
    } catch (err) {
      console.error(err);
      setAlert({ message: 'Error saving project.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(EMPTY);
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title || '',
      shortDescription: project.shortDescription || '',
      detailedDescription: project.detailedDescription || '',
      techStack: project.techStack || '',
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      imageUrl: project.imageUrl || '',
      createdDate: project.createdDate || '',
    });
    setEditId(project.id);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async () => {
    try {
      await deleteProject(deleteId);
      setAlert({ message: 'Project deleted.', type: 'success' });
      setDeleteId(null);
      load();
    } catch (err) {
      console.error(err);
      setAlert({ message: 'Delete failed.', type: 'error' });
    }
  };

  return (
    <div className="space-y-12">
      {alert && <CustomAlert {...alert} onClose={() => setAlert(null)} />}
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-dark">
          {editId ? 'Edit Project' : 'Manage Projects'}
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 flex items-center gap-2 hover:shadow-xl transition-all"
          >
            <FaPlus size={14} /> Add New Project
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 bg-brand-surface border border-brand-border/60 p-4 sm:p-8 rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Project Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="e.g. E-Commerce Platform"
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Project Date</label>
              <input
                type="text"
                value={form.createdDate}
                onChange={(e) => setForm({ ...form, createdDate: e.target.value })}
                placeholder="e.g. Jan 2024 - Mar 2024"
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Short Description</label>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                placeholder="A brief overview of the project..."
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Detailed Description</label>
              <textarea
                value={form.detailedDescription}
                onChange={(e) => setForm({ ...form, detailedDescription: e.target.value })}
                rows={4}
                placeholder="Talk about the problem, solution, and features..."
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Tech Stack (comma-separated)</label>
              <input
                type="text"
                value={form.techStack}
                onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                placeholder="e.g. React, Node.js, MongoDB"
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">GitHub Link</label>
              <input
                type="url"
                value={form.githubLink}
                onChange={(e) => setForm({ ...form, githubLink: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Live Demo Link</label>
              <input
                type="url"
                value={form.liveLink}
                onChange={(e) => setForm({ ...form, liveLink: e.target.value })}
                placeholder="https://..."
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-brand-gray ml-1">Project Preview Image</label>
              <div className="flex items-center gap-4">
                <label className="flex-1 flex flex-col items-center justify-center h-32 border-2 border-brand-border border-dashed rounded-2xl cursor-pointer bg-brand-bg/40 hover:bg-brand-bg/70 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="text-sm text-brand-muted">{imageUploading ? 'Uploading...' : 'Click to upload'}</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {form.imageUrl && (
                  <div className="w-32 h-32 rounded-2xl overflow-hidden border border-brand-border bg-brand-bg/40">
                    <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:shadow-xl transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? 'Processing...' : editId ? 'Update Project' : 'Save Project'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-brand-bg/80 text-brand-gray border border-brand-border rounded-2xl font-bold hover:bg-brand-bg transition-all text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table / Card List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-text-main ml-1">Projects List</h3>
        
        {/* Mobile View: Card List */}
        <div className="block md:hidden space-y-4">
          {projects.map((p) => (
            <div key={p.id} className="p-4 bg-brand-surface border border-brand-border/60 rounded-2xl space-y-3 shadow-sm">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className="font-bold text-text-main text-sm">{p.title}</h4>
                  <p className="text-brand-gray text-[11px] mt-1 line-clamp-2">{p.shortDescription}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(p.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {p.techStack?.split(',')
                  .map(s => s.trim())
                  .filter(Boolean)
                  .map(s => (
                    <span key={s} className="text-[9px] bg-brand-primary-light text-brand-primary border border-brand-border px-2 py-0.5 rounded-md font-bold">{s}</span>
                  ))}
              </div>

              {(p.githubLink || p.liveLink) && (
                <div className="flex gap-3 pt-2 text-brand-muted text-xs border-t border-brand-border/40">
                  {p.githubLink && (
                    <a href={p.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand-primary">
                      <FaGithub size={12} /> GitHub
                    </a>
                  )}
                  {p.liveLink && (
                    <a href={p.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand-primary">
                      <FaLink size={12} /> Live Demo
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-hidden border border-brand-border rounded-[24px] bg-brand-surface">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-brand-muted uppercase bg-brand-bg/60 border-b border-brand-border">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Stack</th>
                <th className="px-6 py-4">Links</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-brand-bg/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-text-main">{p.title}</p>
                    <p className="text-brand-gray text-xs truncate max-w-xs">{p.shortDescription}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.techStack?.split(',')
                        .map(s => s.trim())
                        .filter(Boolean)
                        .slice(0, 3)
                        .map(s => (
                          <span key={s} className="text-[10px] bg-brand-primary-light text-brand-primary border border-brand-border px-2 py-0.5 rounded-md font-bold">{s}</span>
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3 text-brand-muted">
                      {p.githubLink && <FaGithub />}
                      {p.liveLink && <FaLink />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 justify-center mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i)}
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                i === page 
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                  : 'bg-brand-surface border border-brand-border text-brand-gray hover:bg-brand-bg'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-brand-surface border border-brand-border p-8 rounded-[32px] max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-text-main mb-2">Delete Project?</h3>
            <p className="text-brand-gray mb-8">This action is permanent and cannot be undone. Are you sure you want to remove this project?</p>
            <div className="flex gap-4">
              <button onClick={handleDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all">Delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-4 bg-brand-bg text-brand-gray border border-brand-border rounded-2xl font-bold hover:bg-brand-bg/80 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
