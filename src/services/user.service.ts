import apiClient from '@/lib/api-client';
import { UserResponse, ApiResponse } from './auth.service';

export interface UpdateUserRequest {
  name?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  partnerName?: string;
  anniversaryDate?: string;
}

class UserService {
  /**
   * Get user profile
   */
  async getProfile(): Promise<UserResponse> {
    const response = await apiClient.get<ApiResponse<UserResponse>>('/users/profile');
    return response.data.data!;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateUserRequest): Promise<UserResponse> {
    const response = await apiClient.put<ApiResponse<UserResponse>>('/users/profile', data);
    
    // Update local storage
    if (response.data.data) {
      localStorage.setItem('eralove-user', JSON.stringify(response.data.data));
    }
    
    return response.data.data!;
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<void> {
    await apiClient.delete('/users/account');
    
    // Clear local storage
    localStorage.removeItem('eralove-token');
    localStorage.removeItem('eralove-user');
    localStorage.removeItem('eralove-refresh-token');
  }
}

export default new UserService();
