import API from './axios';

// URL RESOLVER
export const resolveUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // If it is a Cloudinary image, inject quality, auto-format, and width scale parameters
    if (url.includes('res.cloudinary.com') && url.includes('/image/upload/') && !url.toLowerCase().includes('.pdf')) {
      return url.replace('/image/upload/', '/image/upload/q_auto,f_auto,w_800/');
    }
    return url;
  }
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return `${baseUrl}/uploads/${url}`;
};

// DATE SORTING UTILITY (Descending, e.g. Present first)
export const sortItemsByDate = (items, dateField = 'createdDate') => {
  if (!Array.isArray(items)) return [];

  const parseDuration = (durationStr) => {
    if (!durationStr) return { endScore: 0, startScore: 0 };

    const lower = durationStr.toLowerCase().trim();
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    let endYear = 0;
    let endMonth = 0;
    let startYear = 0;
    let startMonth = 0;

    // Match 4-digit years
    const years = durationStr.match(/\b(20\d{2}|19\d{2})\b/g);

    if (lower.includes('present')) {
      endYear = 9999;
      endMonth = 12;
      if (years && years.length > 0) {
        startYear = parseInt(years[0], 10);
      }
    } else if (years && years.length > 0) {
      if (years.length >= 2) {
        startYear = parseInt(years[0], 10);
        endYear = parseInt(years[1], 10);
      } else {
        startYear = parseInt(years[0], 10);
        endYear = startYear;
      }
    } else {
      // Match 2-digit years
      const shortYears = durationStr.match(/\b\d{2}\b/g);
      if (shortYears && shortYears.length >= 2) {
        startYear = parseInt(shortYears[0], 10) + 2000;
        endYear = parseInt(shortYears[1], 10) + 2000;
      } else if (shortYears && shortYears.length === 1) {
        startYear = parseInt(shortYears[0], 10) + 2000;
        endYear = startYear;
      }
    }

    // Extract months
    const foundMonths = [];
    months.forEach((m, idx) => {
      let index = lower.indexOf(m);
      while (index !== -1) {
        foundMonths.push({ month: idx + 1, index });
        index = lower.indexOf(m, index + 1);
      }
    });

    foundMonths.sort((a, b) => a.index - b.index);

    if (foundMonths.length >= 2) {
      startMonth = foundMonths[0].month;
      endMonth = foundMonths[1].month;
    } else if (foundMonths.length === 1) {
      startMonth = foundMonths[0].month;
      endMonth = foundMonths[0].month;
    }

    return {
      endScore: endYear * 100 + endMonth,
      startScore: startYear * 100 + startMonth
    };
  };

  return [...items].sort((a, b) => {
    const valA = a[dateField] || '';
    const valB = b[dateField] || '';

    const scoreA = parseDuration(valA);
    const scoreB = parseDuration(valB);

    if (scoreB.startScore !== scoreA.startScore) {
      return scoreB.startScore - scoreA.startScore;
    }
    return scoreB.endScore - scoreA.endScore;
  });
};

// Helper to refresh localStorage cache in the background by fetching individual endpoints
const refreshPortfolioCache = () => {
  return Promise.all([
    API.get('/api/profile'),
    API.get('/api/skills'),
    API.get('/api/projects', { params: { page: 0, size: 100 } }),
    API.get('/api/achievements', { params: { page: 0, size: 100 } }),
    API.get('/api/certifications', { params: { page: 0, size: 100 } }),
    API.get('/api/internships')
  ])
  .then(([profileRes, skillsRes, projectsRes, achievementsRes, certificationsRes, internshipsRes]) => {
    const data = {
      profile: profileRes.data,
      skills: skillsRes.data,
      projects: projectsRes.data?.content || [],
      achievements: achievementsRes.data?.content || [],
      certifications: certificationsRes.data?.content || [],
      internships: internshipsRes.data || []
    };
    localStorage.setItem('portfolio_data', JSON.stringify(data));
  })
  .catch((err) => console.error("Failed to background refresh portfolio cache:", err));
};

const withCacheRefresh = (apiCall) => {
  return (...args) => 
    apiCall(...args).then((res) => {
      refreshPortfolioCache();
      return res;
    });
};

// AUTH
export const loginAdmin = (data) => API.post('/api/auth/login', data);

// PROJECTS
export const getProjects = (params) => API.get('/api/projects', { params });
export const getProject = (id) => API.get(`/api/projects/${id}`);
export const createProject = withCacheRefresh((data) => API.post('/api/projects', data));
export const updateProject = withCacheRefresh((id, data) => API.put(`/api/projects/${id}`, data));
export const deleteProject = withCacheRefresh((id) => API.delete(`/api/projects/${id}`));
export const uploadProjectImage = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return API.post('/api/projects/upload-image', fd);
};

// ACHIEVEMENTS
export const getAchievements = (params) => API.get('/api/achievements', { params });
export const createAchievement = withCacheRefresh((data) => API.post('/api/achievements', data));
export const updateAchievement = withCacheRefresh((id, data) => API.put(`/api/achievements/${id}`, data));
export const deleteAchievement = withCacheRefresh((id) => API.delete(`/api/achievements/${id}`));
export const uploadAchievementImage = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return API.post('/api/achievements/upload-image', fd);
};

// CERTIFICATIONS
export const getCertifications = (params) => API.get('/api/certifications', { params });
export const createCertification = withCacheRefresh((data) => API.post('/api/certifications', data));
export const updateCertification = withCacheRefresh((id, data) => API.put(`/api/certifications/${id}`, data));
export const deleteCertification = withCacheRefresh((id) => API.delete(`/api/certifications/${id}`));
export const uploadCertificationImage = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return API.post('/api/certifications/upload-image', fd);
};

// CONTACT
export const sendContactMessage = (data) => API.post('/api/contact', data);
export const getContactMessages = () => API.get('/api/contact');
export const deleteContactMessage = (id) => API.delete(`/api/contact/${id}`);

// INTERNSHIPS
export const getInternships = () => API.get('/api/internships');
export const createInternship = withCacheRefresh((data) => API.post('/api/internships', data));
export const updateInternship = withCacheRefresh((id, data) => API.put(`/api/internships/${id}`, data));
export const deleteInternship = withCacheRefresh((id) => API.delete(`/api/internships/${id}`));
export const uploadInternshipFile = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return API.post('/api/internships/upload', fd);
};

// SKILLS
export const getSkills = () => API.get('/api/skills');
export const getSkillsByCategory = (category) => API.get(`/api/skills/category/${category}`);
export const createSkill = withCacheRefresh((data) => API.post('/api/skills', data));
export const deleteSkill = withCacheRefresh((id) => API.delete(`/api/skills/${id}`));

// PROFILE SETTINGS
export const getProfileSettings = () => API.get('/api/profile');
export const updateProfileSettings = withCacheRefresh((data) => API.post('/api/profile/update', data));
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post('/api/profile/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// PUBLIC PORTFOLIO CONSOLIDATED DATA
export const getPortfolioDetails = () => API.get('/api/public/portfolio');

