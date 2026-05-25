import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiClock, FiBriefcase, FiEdit, FiFileText } from 'react-icons/fi';
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

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-6 text-brand-muted text-sm">Loading...</div>
        ) : internships.length === 0 ? (
          <div className="text-center py-6 text-brand-muted text-sm">No internships found.</div>
        ) : (
          internships.map((intern) => (
            <div key={intern.id} className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex items-start justify-between group hover:border-brand-primary/30 transition-all">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-brand-bg/80 border border-brand-border/40 rounded-xl flex items-center justify-center text-brand-primary text-xl">
                  <FiBriefcase />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-text-main">{intern.title}</h4>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-brand-bg text-brand-gray border border-brand-border/40 rounded-full uppercase tracking-tighter">{intern.type}</span>
                  </div>
                  <p className="text-sm text-brand-primary font-semibold">{intern.company}</p>
                  <div className="flex items-center gap-3 mt-1 text-brand-muted text-xs">
                    <span className="flex items-center gap-1"><FiClock /> {intern.duration}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(intern)}
                  className="p-2 text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDelete(intern.id)}
                  className="p-2 text-brand-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
