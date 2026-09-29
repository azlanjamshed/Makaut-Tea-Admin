import api from './client';

export const getDashboardStats = async () => {
  return await api.get('/admin/dashboard');
};
