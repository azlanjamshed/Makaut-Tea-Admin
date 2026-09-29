import api from './client';

export const getAnnouncementRequests = async (params = {}) => {
  return await api.get('/admin/announcement-requests', { params });
};

export const getAnnouncementRequestCounts = async () => {
  return await api.get('/admin/announcement-requests/counts');
};

export const getAnnouncementRequestById = async (id) => {
  return await api.get(`/admin/announcement-requests/${id}`);
};

export const approveAnnouncementRequest = async (id, data = {}) => {
  return await api.post(`/admin/announcement-requests/${id}/approve`, data);
};

export const rejectAnnouncementRequest = async (id, data = {}) => {
  return await api.post(`/admin/announcement-requests/${id}/reject`, data);
};
