import apiClient from '@/lib/api-client';

export interface UploadFileResponse {
  file_path: string;
  file_name: string;
  file_size: number;
  content_type: string;
  url: string;
  message: string;
}

export interface UploadMultipleResponse {
  files: UploadFileResponse[];
  total: number;
  success: number;
  failed: number;
  errors?: string[];
}

class UploadService {
  /**
   * Upload a single file
   */
  async uploadFile(file: File, folder: string = 'photos'): Promise<UploadFileResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await apiClient.post<UploadFileResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(files: File[], folder: string = 'photos'): Promise<UploadMultipleResponse> {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('folder', folder);

    const response = await apiClient.post<UploadMultipleResponse>('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Delete a file
   */
  async deleteFile(filePath: string): Promise<void> {
    await apiClient.delete('/upload', {
      data: { file_path: filePath },
    });
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<UploadFileResponse> {
    return this.uploadFile(file, 'avatars');
  }

  /**
   * Upload photo
   */
  async uploadPhoto(file: File): Promise<UploadFileResponse> {
    return this.uploadFile(file, 'photos');
  }

  /**
   * Upload document
   */
  async uploadDocument(file: File): Promise<UploadFileResponse> {
    return this.uploadFile(file, 'documents');
  }
}

export default new UploadService();
