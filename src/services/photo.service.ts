import apiClient from '@/lib/api-client';
import { ApiResponse } from './auth.service';

export interface PhotoResponse {
  id: string;
  userId: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  tags?: string[];
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePhotoRequest {
  file_path: string;  // Path from upload endpoint
  title: string;
  description?: string;
  tags?: string[];
  date?: string;
  location?: string;
  is_private?: boolean;
}

export interface UpdatePhotoRequest {
  title?: string;
  description?: string;
  tags?: string[];
}

export interface PhotoListResponse {
  data: PhotoResponse[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

class PhotoService {
  /**
   * Create a new photo with pre-uploaded file path
   */
  async createPhoto(data: CreatePhotoRequest): Promise<PhotoResponse> {
    const response = await apiClient.post<PhotoResponse>('/photos', data);
    return response.data;
  }

  /**
   * Get all photos with pagination
   */
  async getPhotos(page: number = 1, limit: number = 10): Promise<PhotoListResponse> {
    const response = await apiClient.get<PhotoListResponse>('/photos', {
      params: { page, limit },
    });
    
    return response.data;
  }

  /**
   * Get a single photo by ID
   */
  async getPhoto(photoId: string): Promise<PhotoResponse> {
    const response = await apiClient.get<ApiResponse<PhotoResponse>>(`/photos/${photoId}`);
    return response.data.data!;
  }

  /**
   * Update photo metadata (not the image itself)
   */
  async updatePhoto(photoId: string, data: UpdatePhotoRequest): Promise<PhotoResponse> {
    const response = await apiClient.put<ApiResponse<PhotoResponse>>(`/photos/${photoId}`, data);
    return response.data.data!;
  }

  /**
   * Delete a photo
   */
  async deletePhoto(photoId: string): Promise<void> {
    await apiClient.delete(`/photos/${photoId}`);
  }

  /**
   * Get photos by tags
   */
  async getPhotosByTags(tags: string[], page: number = 1, limit: number = 10): Promise<PhotoListResponse> {
    const response = await apiClient.get<PhotoListResponse>('/photos', {
      params: { 
        tags: tags.join(','),
        page, 
        limit 
      },
    });
    
    return response.data;
  }
}

export default new PhotoService();
