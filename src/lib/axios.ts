import axios from 'axios';
import { TOKEN_COOKIE_NAME } from './constants';

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${TOKEN_COOKIE_NAME}=`))
      ?.split('=')[1];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default apiClient;
