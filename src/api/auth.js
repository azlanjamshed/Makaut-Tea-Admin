import api from './client';

export const adminLogin = async ({ email, password }) => {
  return await api.post('/admin/login', { email, password });
};

export const getAdminMe = async () => {
  return await api.get('/admin/me');
};
