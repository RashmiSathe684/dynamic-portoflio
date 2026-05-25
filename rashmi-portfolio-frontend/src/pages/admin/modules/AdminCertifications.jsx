import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  uploadCertificationImage,
} from '../../../api/services';

import { FaTimes, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import CustomAlert from '../../../components/CustomAlert';

export default function AdminCertifications() {
  const formRef = useRef(null);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);

  const [form, setForm] = useState({
    title: '',
    organization: '',
    description: '',
    issueDate: '',
    imageUrls: [],
    certificateLink: '',
  });

  const fetchCertifications = useCallback(() => {
    getCertifications({ page: 0, size: 100 })
      .then((res) => {
        setItems(res.data.content);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const uploadPromises = files.map(file => uploadCertificationImage(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(res => res.data);

      setForm({
        ...form,
        imageUrls: [...form.imageUrls, ...newUrls],
      });
      setAlert({ message: 'Images uploaded successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setAlert({ message: 'Image upload failed.', type: 'error' });
    }
  };

  const removeImage = (index) => {
    setForm({
      ...form,
      imageUrls: form.imageUrls.filter((_, i) => i !== index),
    });
  };

  const resetForm = () => {
    setForm({
      title: '',
      organization: '',
      description: '',
      issueDate: '',
      imageUrls: [],
      certificateLink: '',
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...form,
      imageUrl: form.imageUrls.join(','),
    };

    try {
      if (editingId) {
        await updateCertification(editingId, dataToSend);
        setAlert({ message: 'Certification updated successfully!', type: 'success' });
      } else {
        await createCertification(dataToSend);
        setAlert({ message: 'Certification created successfully!', type: 'success' });
      }

      resetForm();
      fetchCertifications();
    } catch (err) {
      console.error(err);
      setAlert({ message: 'Operation failed.', type: 'error' });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      title: item.title || '',
      organization: item.organization || '',
      description: item.description || '',
      issueDate: item.issueDate || '',
      imageUrls: item.imageUrl ? item.imageUrl.split(',') : [],
      certificateLink: item.certificateLink || '',
    });
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await deleteCertification(id);
      setAlert({ message: 'Certification deleted.', type: 'success' });
      fetchCertifications();
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
          {editingId ? 'Edit Certification' : 'Add New Certification'}
        </h2>
        {editingId && (
          <button onClick={resetForm} className="text-sm font-bold text-brand-primary">
            + New Certification
          </button>
        )}
      </div>

      {/* FORM */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 bg-brand-surface border border-brand-border/60 p-4 sm:p-8 rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-gray ml-1">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. AWS Certified Developer"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-gray ml-1">Organization</label>
            <input
              type="text"
              name="organization"
              placeholder="e.g. Amazon Web Services"
              value={form.organization}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-gray ml-1">Description</label>
          <textarea
            name="description"
            placeholder="Course details, key skills learned..."
            rows="4"
            value={form.description}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-gray ml-1">Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={form.issueDate}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-gray ml-1">Certificate URL</label>
            <input
              type="text"
              name="certificateLink"
              placeholder="https://..."
              value={form.certificateLink}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-brand-gray ml-1">Certificate Badges / Images</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-brand-border border-dashed rounded-2xl cursor-pointer bg-brand-bg/40 hover:bg-brand-bg/70 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaPlus className="text-brand-muted mb-2" />
                <p className="text-sm text-brand-muted">Click to upload images</p>
              </div>
              <input type="file" multiple onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {form.imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-4 p-4 bg-brand-bg/40 rounded-2xl border border-brand-border shadow-sm">
            {form.imageUrls.map((url, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={url}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-xl border border-brand-border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:shadow-xl transition-all text-sm sm:text-base"
          >
            {editingId ? 'Update Certification' : 'Save Certification'}
          </button>
          
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-brand-bg/80 text-brand-gray border border-brand-border rounded-2xl font-bold hover:bg-brand-bg transition-all text-sm sm:text-base"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* LIST */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-text-main ml-1">Existing Certifications</h3>
        
        {/* Mobile View: Card List */}
        <div className="block md:hidden space-y-4">
          {items.map((item) => (
            <div key={item.id} className="p-4 bg-brand-surface border border-brand-border/60 rounded-2xl space-y-2 shadow-sm">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className="font-bold text-text-main text-sm">{item.title}</h4>
                  <p className="text-brand-gray text-[11px] mt-1">{item.organization}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
              <div className="text-[11px] text-brand-muted font-medium pt-1.5 border-t border-brand-border/40">
                📅 Issued: {item.issueDate || '—'}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-hidden border border-brand-border rounded-[24px] bg-brand-surface">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-brand-muted uppercase bg-brand-bg/60 border-b border-brand-border">
              <tr>
                <th className="px-6 py-4">Certification Details</th>
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-brand-bg/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-text-main">{item.title}</p>
                    <p className="text-brand-gray text-xs">Issued: {item.issueDate || '—'}</p>
                  </td>
                  <td className="px-6 py-4 text-brand-gray font-medium">
                    {item.organization}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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
    </div>
  );
}