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
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
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
    
    // Store tokens and user data (response is already transformed to camelCase)
    if (response.data.accessToken) {
      localStorage.setItem('eralove-token', response.data.accessToken);
      localStorage.setItem('eralove-user', JSON.stringify(response.data.user));
      
      // Store refresh token if provided
      if (response.data.refreshToken) {
        localStorage.setItem('eralove-refresh-token', response.data.refreshToken);
      }
    }
    
    return response.data;
  }

  /**
   * Logout user
   */
  async logout(refreshToken?: string): Promise<void> {
    try {
      if (refreshToken) {
        // Use camelCase - will be converted to snake_case by interceptor
        await apiClient.post('/auth/logout', { refreshToken });
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
   * Get stored access token
   */
  getToken(): string | null {
    return localStorage.getItem('eralove-token');
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('eralove-refresh-token');
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<LoginResponse | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await apiClient.post<LoginResponse>('/auth/refresh', {
        refreshToken,
      });

      // Update stored tokens
      if (response.data.accessToken) {
        localStorage.setItem('eralove-token', response.data.accessToken);
        localStorage.setItem('eralove-user', JSON.stringify(response.data.user));
        
        if (response.data.refreshToken) {
          localStorage.setItem('eralove-refresh-token', response.data.refreshToken);
        }
      }

      return response.data;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // Clear tokens on refresh failure
      this.logout();
      return null;
    }
  }
}

export default new AuthService();
