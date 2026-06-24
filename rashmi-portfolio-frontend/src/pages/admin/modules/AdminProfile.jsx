import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiFileText, FiUser } from 'react-icons/fi';
import { getProfileSettings, updateProfileSettings, uploadFile, resolveUrl } from '../../../api/services';
import CustomAlert from '../../../components/CustomAlert';

export default function AdminProfile() {
  const [settings, setSettings] = useState({ profilePhotoUrl: '', resumeUrl: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [photoError, setPhotoError] = useState(false);

  const fetchSettings = useCallback(() => {
    getProfileSettings()
      .then((res) => {
        if (res.data) setSettings(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    setPhotoError(false);
  }, [settings.profilePhotoUrl]);

  const handleUpload = async (type) => {
    const file = type === 'photo' ? photoFile : resumeFile;
    if (!file) return;

    setLoading(true);
    try {
      const res = await uploadFile(file);
      const fileName = res.data;
      
      const newSettings = { ...settings };
      if (type === 'photo') newSettings.profilePhotoUrl = fileName;
      else newSettings.resumeUrl = fileName;

      await updateProfileSettings(newSettings);
      setSettings(newSettings);
      setAlert({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`, type: 'success' });
      if (type === 'photo') setPhotoFile(null);
      else setResumeFile(null);
    } catch (err) {
      console.error(err);
      setAlert({ message: `Failed to update ${type}.`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h3 className="text-xl font-bold text-text-main mb-1">Profile Media Settings</h3>
        <p className="text-sm text-brand-muted">Manage your profile photo and resume displayed on the home page.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Photo */}
        <div className="bg-brand-surface border border-brand-border/60 rounded-[24px] p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary">
              <FiUser />
            </div>
            <span className="font-bold text-text-main">Profile Photo</span>
          </div>
          
          <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-4 border-brand-border shadow-md bg-brand-bg/40 flex items-center justify-center">
            {settings.profilePhotoUrl && !photoError ? (
              <img 
                src={resolveUrl(settings.profilePhotoUrl)} 
                alt="Profile" 
                className="w-full h-full object-cover" 
                onError={() => setPhotoError(true)}
              />
            ) : (
              <FiUser size={32} className="text-brand-muted" />
            )}
          </div>

          <input
            type="file"
            id="photo-upload"
            className="hidden"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files[0])}
          />
          <label
            htmlFor="photo-upload"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-bg/40 border border-brand-border rounded-xl text-xs font-bold text-brand-gray cursor-pointer hover:bg-brand-bg/70 transition-all"
          >
            {photoFile ? photoFile.name : 'Choose Photo'}
          </label>
          
          <button
            disabled={!photoFile || loading}
            onClick={() => handleUpload('photo')}
            className="w-full py-3 bg-brand-primary text-white rounded-xl text-sm font-bold disabled:opacity-50 shadow-lg shadow-brand-primary/20"
          >
            Update Photo
          </button>
        </div>

        {/* Resume */}
        <div className="bg-brand-surface border border-brand-border/60 rounded-[24px] p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-100/10 rounded-lg flex items-center justify-center text-blue-400">
              <FiFileText />
            </div>
            <span className="font-bold text-text-main">Resume (PDF)</span>
          </div>

          <div className="h-32 flex flex-col items-center justify-center bg-brand-bg/40 rounded-2xl border-2 border-dashed border-brand-border text-brand-muted">
            {settings.resumeUrl ? (
              <div className="text-center">
                <FiCheck className="text-green-500 text-2xl mx-auto mb-1" />
                <span className="text-[10px] font-bold text-brand-muted truncate max-w-[150px] block">{settings.resumeUrl}</span>
              </div>
            ) : (
              <span className="text-[10px] font-bold">No resume uploaded</span>
            )}
          </div>

          <input
            type="file"
            id="resume-upload"
            className="hidden"
            accept=".pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
          />
          <label
            htmlFor="resume-upload"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-bg/40 border border-brand-border rounded-xl text-xs font-bold text-brand-gray cursor-pointer hover:bg-brand-bg/70 transition-all"
          >
            {resumeFile ? resumeFile.name : 'Choose PDF'}
          </label>

          <button
            disabled={!resumeFile || loading}
            onClick={() => handleUpload('resume')}
            className="w-full py-3 bg-brand-primary text-white rounded-xl text-sm font-bold disabled:opacity-50 shadow-lg shadow-brand-primary/20"
          >
            Update Resume
          </button>
        </div>
      </div>

      {alert && <CustomAlert {...alert} onClose={() => setAlert(null)} />}
    </div>
  );
}
