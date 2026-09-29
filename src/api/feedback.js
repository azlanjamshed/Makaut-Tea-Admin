import client from './client';

export const getFeedback = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.type && params.type !== 'all') query.append('type', params.type);
  if (params.status && params.status !== 'all') query.append('status', params.status);
  if (params.search) query.append('search', params.search);

  const res = await client.get(`/admin/feedback?${query.toString()}`);
  return res.data;
};

export const getFeedbackById = async (id) => {
  const res = await client.get(`/admin/feedback/${id}`);
  return res.data;
};

export const updateFeedback = async (id, data) => {
  const res = await client.patch(`/admin/feedback/${id}`, data);
  return res.data;
};

export const deleteFeedback = async (id) => {
  const res = await client.delete(`/admin/feedback/${id}`);
  return res.data;
};
