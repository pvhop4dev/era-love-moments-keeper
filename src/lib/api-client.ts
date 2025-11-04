import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { keysToCamel, keysToSnake } from './case-converter';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token and transform request data
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('eralove-token');
    console.log('[API Client] Request to:', config.url, 'Token:', token ? 'EXISTS' : 'MISSING');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API Client] Authorization header set:', config.headers.Authorization.substring(0, 30) + '...');
    } else {
      console.warn('[API Client] No token found, request will fail if auth required');
    }
    
    // Transform camelCase to snake_case for request body
    if (config.data && typeof config.data === 'object') {
      config.data = keysToSnake(config.data);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor - Transform response data and handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Transform snake_case to camelCase for response data
    if (response.data && typeof response.data === 'object') {
      response.data = keysToCamel(response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    // Transform error response data as well
    if (error.response?.data && typeof error.response.data === 'object') {
      error.response.data = keysToCamel(error.response.data);
    }
    
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for login/register/refresh endpoints
      if (originalRequest.url?.includes('/auth/login') || 
          originalRequest.url?.includes('/auth/register') ||
          originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue the request while token is being refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('eralove-refresh-token');
      
      if (!refreshToken) {
        // No refresh token, redirect to login
        localStorage.removeItem('eralove-token');
        localStorage.removeItem('eralove-user');
        localStorage.removeItem('eralove-refresh-token');
        
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
        
        return Promise.reject(error);
      }

      try {
        // Try to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken
        });

        const data = keysToCamel(response.data);
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        // Update stored tokens
        localStorage.setItem('eralove-token', newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('eralove-refresh-token', newRefreshToken);
        }
        if (data.user) {
          localStorage.setItem('eralove-user', JSON.stringify(data.user));
        }

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;

        // Refresh failed, clear auth data and redirect
        localStorage.removeItem('eralove-token');
        localStorage.removeItem('eralove-user');
        localStorage.removeItem('eralove-refresh-token');
        
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
