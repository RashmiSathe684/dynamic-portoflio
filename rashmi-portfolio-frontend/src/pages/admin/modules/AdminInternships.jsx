import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiClock, FiBriefcase, FiFileText } from 'react-icons/fi';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { getInternships, createInternship, updateInternship, deleteInternship, uploadInternshipFile, resolveUrl, sortItemsByDate } from '../../../api/services';

export default function AdminInternships() {
  const formRef = useRef(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    duration: '',
    description: '',
    location: '',
    type: 'Internship',
    certificateUrl: '',
    downloadUrl: ''
  });

  const fetchInternships = useCallback(() => {
    getInternships()
      .then((res) => {
        setInternships(sortItemsByDate(res.data, 'duration'));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  const resetForm = () => {
    setFormData({ title: '', company: '', duration: '', description: '', location: '', type: 'Internship', certificateUrl: '', downloadUrl: '' });
    setEditId(null);
    setShowAdd(false);
  };

  const handleEdit = (intern) => {
    setFormData({
      title: intern.title || '',
      company: intern.company || '',
      duration: intern.duration || '',
      description: intern.description || '',
      location: intern.location || '',
      type: intern.type || 'Internship',
      certificateUrl: intern.certificateUrl || '',
      downloadUrl: intern.downloadUrl || ''
    });
    setEditId(intern.id);
    setShowAdd(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadInternshipFile(file);
      setFormData((prev) => ({ ...prev, downloadUrl: res.data }));
      alert('File uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateInternship(editId, formData);
        alert('Internship updated successfully!');
      } else {
        await createInternship(formData);
        alert('Internship created successfully!');
      }
      resetForm();
      fetchInternships();
    } catch (err) {
      console.error(err);
      alert('Failed to save internship');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this internship?')) {
      try {
        await deleteInternship(id);
        fetchInternships();
      } catch (err) {
        console.error(err);
        alert('Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-brand-dark">
          {editId ? 'Edit Internship' : 'Internships & Industrial Experience'}
        </h3>
        <button
          onClick={() => {
            if (showAdd) resetForm();
            else setShowAdd(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20"
        >
          {showAdd ? 'Cancel' : <><FiPlus /> Add New</>}
        </button>
      </div>

      {showAdd && (
        <motion.form
          ref={formRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-8 bg-brand-surface border border-brand-border/60 p-8 rounded-3xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Job Title *</label>
              <input
                required
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Backend Development Intern"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Company *</label>
              <input
                required
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. CodeAlpha"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Experience Type</label>
              <select
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Internship" className="bg-brand-surface text-text-main">Internship</option>
                <option value="Industrial Training" className="bg-brand-surface text-text-main">Industrial Training</option>
                <option value="Freelance" className="bg-brand-surface text-text-main">Freelance</option>
                <option value="Full Time" className="bg-brand-surface text-text-main">Full Time</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Duration *</label>
              <input
                required
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. May 2026 – Jun 2026"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Location</label>
              <input
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Remote / Solapur"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Certificate / Verification Link</label>
              <input
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm"
                value={formData.certificateUrl}
                onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
                placeholder="Paste external verification URL..."
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="text-sm font-bold text-brand-gray ml-1">Upload Document (Offer Letter / Certificate PDF or Image)</label>
              <div className="flex items-center gap-4">
                <label className="flex-1 flex flex-col items-center justify-center h-32 border-2 border-brand-border border-dashed rounded-2xl cursor-pointer bg-brand-bg/40 hover:bg-brand-bg/70 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="text-sm text-brand-muted">{uploading ? 'Uploading...' : 'Click to upload PDF/Image'}</p>
                  </div>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
                {formData.downloadUrl && (
                  <div className="w-32 h-32 rounded-2xl overflow-hidden border border-brand-border flex flex-col items-center justify-center p-2 bg-brand-bg/40">
                    <FiFileText size={32} className="text-brand-primary mb-1" />
                    <span className="text-[10px] font-bold text-brand-muted truncate max-w-full block">
                      {formData.downloadUrl.split('/').pop()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Description *</label>
              <textarea
                required
                rows="4"
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your role and key accomplishments..."
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:shadow-xl transition-all">
              {editId ? 'Update Internship' : 'Save Internship'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-8 py-4 bg-brand-bg/80 text-brand-gray border border-brand-border rounded-2xl font-bold hover:bg-brand-bg transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-6 text-brand-muted text-sm">Loading...</div>
        ) : internships.length === 0 ? (
          <div className="text-center py-6 text-brand-muted text-sm">No internships found.</div>
        ) : (
          <>
            {/* Mobile View: Card List */}
            <div className="block md:hidden space-y-4">
              {internships.map((intern) => (
                <div key={intern.id} className="p-4 bg-brand-surface border border-brand-border/60 rounded-2xl space-y-2 shadow-sm">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="font-bold text-text-main text-sm">{intern.title}</h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-brand-bg text-brand-gray border border-brand-border/40 rounded-full uppercase tracking-tighter shrink-0">{intern.type}</span>
                      </div>
                      <p className="text-brand-primary text-xs font-semibold mt-0.5">{intern.company}</p>
                      <p className="text-brand-gray text-[11px] mt-1 line-clamp-2">{intern.description}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(intern)}
                        className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(intern.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] text-brand-muted font-medium pt-1.5 border-t border-brand-border/40 flex items-center gap-1">
                    <FiClock size={12} /> {intern.duration}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-hidden border border-brand-border rounded-[24px] bg-brand-surface">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-brand-muted uppercase bg-brand-bg/60 border-b border-brand-border">
                  <tr>
                    <th className="px-6 py-4">Role & Company</th>
                    <th className="px-6 py-4">Duration & Type</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40">
                  {internships.map((intern) => (
                    <tr key={intern.id} className="hover:bg-brand-bg/40 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-text-main">{intern.title}</p>
                        <p className="text-brand-primary text-xs font-semibold">{intern.company}</p>
                        <p className="text-brand-gray text-xs line-clamp-1 max-w-md mt-0.5">{intern.description}</p>
                      </td>
                      <td className="px-6 py-4 text-brand-gray font-medium">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1 text-xs text-brand-muted"><FiClock size={12} /> {intern.duration}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-brand-bg text-brand-gray border border-brand-border/40 rounded-full uppercase tracking-tighter w-fit">{intern.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-brand-gray text-xs">
                        {intern.location || '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(intern)}
                            className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(intern.id)}
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
          </>
        )}
      </div>
    </div>
  );
}
