import axios from 'axios';
import Cookies from 'js-cookie';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      const path = window.location.pathname;
      const publicPaths = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];
      if (!publicPaths.some((p) => path.startsWith(p))) {
        Cookies.remove('token');
        Cookies.remove('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const swrFetcher = (url) => api.get(url).then((res) => res.data);

export const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors?.[0]?.msg ||
  'حدث خطأ، حاول مرة أخرى';

export default api;
