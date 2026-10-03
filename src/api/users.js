import api from './client';

export const getUsers = async (params = {}) => {
  return await api.get('/admin/users', { params });
};

export const getUserById = async (id) => {
  return await api.get(`/admin/users/${id}`);
};

export const suspendUser = async (id, { reason = '', durationDays = 7 }) => {
  return await api.put(`/admin/users/${id}/suspend`, { reason, durationDays });
};

export const banUser = async (id, { reason }) => {
  return await api.put(`/admin/users/${id}/ban`, { reason });
};

export const restoreUser = async (id) => {
  return await api.put(`/admin/users/${id}/restore`);
};

export const getUserPosts = async (userId, params = {}) => {
  try {
    const res = await api.get('/admin/posts', { params: { user: userId, limit: 50, ...params } });
    return res;
  } catch (err) {
    return await api.get(`/posts/user/${userId}`, { params });
  }
};
