import api from './client';

export const getReports = async (params = {}) => {
  return await api.get('/admin/reports', { params });
};

export const getReportById = async (id) => {
  return await api.get(`/admin/reports/${id}`);
};

export const updateReportStatus = async (id, { status, notes = '' }) => {
  return await api.put(`/admin/reports/${id}/status`, { status, notes });
};

export const resolveReport = async (id, { actionTaken = 'dismiss', notes = '' }) => {
  return await api.put(`/admin/reports/${id}/resolve`, { actionTaken, notes });
};

export const rejectReport = async (id, { notes = '' }) => {
  return await api.put(`/admin/reports/${id}/reject`, { notes });
};

export const takeReportAction = async (id, { action, reason = '', durationDays = 7, notes = '' }) => {
  return await api.post(`/admin/reports/${id}/action`, { action, reason, durationDays, notes });
};
