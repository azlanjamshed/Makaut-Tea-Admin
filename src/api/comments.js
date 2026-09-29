import api from './client';

export const getCommentsByPost = async (postId, params = {}) => {
  return await api.get(`/posts/${postId}/comments`, { params });
};
export const getComments = getCommentsByPost;

export const addComment = async (postId, data) => {
  return await api.post(`/posts/${postId}/comments`, data);
};

export const updateComment = async (commentId, data) => {
  return await api.put(`/comments/${commentId}`, data);
};

export const deleteComment = async (commentId) => {
  return await api.delete(`/comments/${commentId}`);
};

export const getRepliesByComment = async (commentId, params = {}) => {
  return await api.get(`/comments/${commentId}/replies`, { params });
};

export const addReply = async (commentId, data) => {
  return await api.post(`/comments/${commentId}/replies`, data);
};

export const deleteReply = async (commentId, replyId) => {
  return await api.delete(`/comments/${commentId}/replies/${replyId}`);
};
