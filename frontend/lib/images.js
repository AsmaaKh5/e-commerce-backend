import { API_ORIGIN } from './api';

export function getImageUrl(path) {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_ORIGIN}${normalized}`;
}
