import api from './client';

export const getAdminPosts = async (params = {}) => {
  return await api.get('/admin/posts', { params });
};

export const getAdminPostById = async (id) => {
  return await api.get(`/admin/posts/${id}`);
};

export const hidePost = async (id, reason = '') => {
  return await api.put(`/admin/posts/${id}/hide`, { reason });
};

export const unhidePost = async (id) => {
  return await api.put(`/admin/posts/${id}/unhide`);
};

export const deletePost = async (id, reason = '') => {
  return await api.delete(`/admin/posts/${id}`, { data: { reason } });
};

export const restorePost = async (id) => {
  return await api.put(`/admin/posts/${id}/restore`);
};

export const createAdminPost = async (formData) => {
  return await api.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const reactToPost = async (postId, emoji) => {
  return await api.post(`/posts/${postId}/reactions`, { emoji });
};
