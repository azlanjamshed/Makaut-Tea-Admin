import { formatDistanceToNow, format } from 'date-fns';

export const formatCount = (num) => {
  if (num === null || num === undefined) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
};

export const timeAgo = (date) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return formatDistanceToNow(d, { addSuffix: true });
  } catch (err) {
    return '';
  }
};

export const formatDate = (date) => {
  if (!date) return '—';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '—';
    return format(d, 'MMM d, yyyy');
  } catch (err) {
    return '—';
  }
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '—';
    return format(d, 'MMM d, yyyy · h:mm a');
  } catch (err) {
    return '—';
  }
};

export const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const rawApiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
  // If absolute URL, strip /api if present; if relative or empty, default to origin or dev fallback
  let serverUrl = '';
  if (rawApiUrl.startsWith('http://') || rawApiUrl.startsWith('https://')) {
    serverUrl = rawApiUrl.endsWith('/api') ? rawApiUrl.replace(/\/api$/, '') : rawApiUrl;
  } else if (!rawApiUrl || rawApiUrl === '/api') {
    serverUrl = import.meta.env.DEV ? 'http://localhost:5001' : '';
  }
  if (url.startsWith('/')) {
    return `${serverUrl}${url}`;
  }
  return `${serverUrl}/${url}`;
};

export const getRantStatus = (rant) => {
  if (!rant) return 'active';
  if (rant.isDeleted) return 'deleted';
  if (rant.isHidden) return 'hidden';
  if (rant.status) return String(rant.status).toLowerCase();
  return 'active';
};
