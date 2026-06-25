import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { FiBook, FiBookOpen, FiAward } from 'react-icons/fi';
import { getEducation, createEducation, deleteEducation } from '../../../api/services';
import CustomAlert from '../../../components/CustomAlert';

export default function AdminEducation() {
  const [items, setItems] = useState([]);
  const [alert, setAlert] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    degree: '',
    institution: '',
    score: '',
    duration: '',
    iconType: 'GRAD',
  });

  const fetchEducation = useCallback(() => {
    getEducation()
      .then((res) => {
        setItems(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        setAlert({ message: 'Failed to fetch education records.', type: 'error' });
      });
  }, []);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      degree: '',
      institution: '',
      score: '',
      duration: '',
      iconType: 'GRAD',
    });
    setShowAdd(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEducation(form);
      setAlert({ message: 'Education record added successfully!', type: 'success' });
      resetForm();
      fetchEducation();
    } catch (err) {
      console.error(err);
      setAlert({ message: 'Failed to add education record.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this education record?')) return;
    try {
      await deleteEducation(id);
      setAlert({ message: 'Education record deleted.', type: 'success' });
      fetchEducation();
    } catch (err) {
      console.error(err);
      setAlert({ message: 'Failed to delete education record.', type: 'error' });
    }
  };

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

  return (
    <div className="space-y-12">
      {alert && <CustomAlert {...alert} onClose={() => setAlert(null)} />}
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-dark">Education</h2>
        <button
          onClick={() => {
            if (showAdd) resetForm();
            else setShowAdd(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20"
        >
          {showAdd ? 'Cancel' : <><FaPlus /> Add New</>}
        </button>
      </div>

      {/* FORM */}
      {showAdd && (
        <form onSubmit={handleSubmit} className="space-y-8 bg-brand-surface border border-brand-border/60 p-4 sm:p-8 rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Degree / Qualification</label>
              <input
                type="text"
                name="degree"
                placeholder="e.g. Bachelor of Technology in CSE"
                value={form.degree}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Institution / School</label>
              <input
                type="text"
                name="institution"
                placeholder="e.g. Stanford University"
                value={form.institution}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Score / GPA</label>
              <input
                type="text"
                name="score"
                placeholder="e.g. 9.48 or 92%"
                value={form.score}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Duration</label>
              <input
                type="text"
                name="duration"
                placeholder="e.g. 2022 - 2026"
                value={form.duration}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main placeholder-brand-muted/70 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-brand-gray ml-1">Icon Type</label>
              <select
                name="iconType"
                value={form.iconType}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-2xl bg-brand-bg/40 border border-brand-border/80 text-text-main focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
              >
                <option value="GRAD">Graduation / Degree (Award Icon)</option>
                <option value="BOOK">Higher Secondary / Diploma (Book Icon)</option>
                <option value="SCHOOL">Secondary Schooling (Open Book Icon)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:shadow-xl transition-all text-sm sm:text-base cursor-pointer"
            >
              Save Education
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-brand-bg/80 text-brand-gray border border-brand-border rounded-2xl font-bold hover:bg-brand-bg transition-all text-sm sm:text-base cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* LIST */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-text-main ml-1">Existing Education Records</h3>
        
        {items.length === 0 ? (
          <div className="p-8 text-center bg-brand-surface border border-brand-border/60 rounded-3xl text-brand-muted text-sm">
            No education records added yet.
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="block md:hidden space-y-4">
              {items.map((item) => (
                <div key={item.id} className="p-4 bg-brand-surface border border-brand-border/60 rounded-2xl space-y-2 shadow-sm">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                        {getEduIcon(item.iconType)}
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main text-sm">{item.degree}</h4>
                        <p className="text-brand-gray text-[11px] mt-0.5">{item.institution}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between text-[11px] text-brand-muted font-medium pt-2 border-t border-brand-border/40">
                    <span>Score: {item.score}</span>
                    <span>{item.duration}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto border border-brand-border rounded-[24px] bg-brand-surface">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-brand-muted uppercase bg-brand-bg/60 border-b border-brand-border">
                  <tr>
                    <th className="px-6 py-4">Icon</th>
                    <th className="px-6 py-4">Degree / Institution</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-brand-bg/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                          {getEduIcon(item.iconType)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-text-main">{item.degree}</p>
                        <p className="text-brand-gray text-xs">{item.institution}</p>
                      </td>
                      <td className="px-6 py-4 text-brand-gray font-medium">{item.score}</td>
                      <td className="px-6 py-4 text-brand-gray font-medium">{item.duration}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all inline-flex items-center cursor-pointer"
                        >
                          <FaTrash size={16} />
                        </button>
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
