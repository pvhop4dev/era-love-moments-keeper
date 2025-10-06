import apiClient from '@/lib/api-client';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
  partnerId?: string;
  partnerName?: string;
  anniversaryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: UserResponse;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<UserResponse> {
    const response = await apiClient.post<ApiResponse<UserResponse>>('/auth/register', data);
    return response.data.data!;
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    
    // Store token and user data
    if (response.data.access_token) {
      localStorage.setItem('eralove-token', response.data.access_token);
      localStorage.setItem('eralove-user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  /**
   * Logout user
   */
  async logout(refreshToken?: string): Promise<void> {
    try {
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refresh_token: refreshToken });
      }
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('eralove-token');
      localStorage.removeItem('eralove-user');
      localStorage.removeItem('eralove-refresh-token');
    }
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): UserResponse | null {
    const userStr = localStorage.getItem('eralove-user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('eralove-token');
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('eralove-token');
  }
}

export default new AuthService();
