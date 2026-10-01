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

export const resolveImageUrl = (url, preset) => {
  if (!url) return '';
  let fullUrl = url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    fullUrl = url;
  } else {
    const rawApiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
    let serverUrl = '';
    if (rawApiUrl.startsWith('http://') || rawApiUrl.startsWith('https://')) {
      serverUrl = rawApiUrl.endsWith('/api') ? rawApiUrl.replace(/\/api$/, '') : rawApiUrl;
    } else if (!rawApiUrl || rawApiUrl === '/api') {
      serverUrl = import.meta.env.DEV ? 'http://localhost:5001' : '';
    }
    fullUrl = url.startsWith('/') ? `${serverUrl}${url}` : `${serverUrl}/${url}`;
  }

  if (preset && (fullUrl.includes('ik.imagekit.io') || fullUrl.includes('imagekit.io'))) {
    if (!fullUrl.includes('tr=') && !fullUrl.includes('tr:')) {
      const presets = {
        feed: 'w-800,q-80',
        detail: 'w-1200,q-85',
        thumb: 'w-400,q-75',
        avatar: 'w-160,h-160,c-maintain_ratio,q-80',
        full: 'w-1600,q-85',
      };
      const transform = presets[preset] || preset;
      const separator = fullUrl.includes('?') ? '&' : '?';
      return `${fullUrl}${separator}tr=${transform}`;
    }
  }

  return fullUrl;
};

export const getOptimizedImageUrl = (url, preset = 'feed') => resolveImageUrl(url, preset);

export const getRantStatus = (rant) => {
  if (!rant) return 'active';
  if (rant.isDeleted) return 'deleted';
  if (rant.isHidden) return 'hidden';
  if (rant.status) return String(rant.status).toLowerCase();
  return 'active';
};
