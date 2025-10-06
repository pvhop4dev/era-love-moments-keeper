import apiClient from '@/lib/api-client';
import { ApiResponse } from './auth.service';

export interface MatchRequestResponse {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  receiverAvatar?: string;
  status: 'pending' | 'accepted' | 'rejected';
  anniversaryDate?: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
  respondedAt?: string;
}

export interface CreateMatchRequestRequest {
  receiverEmail: string;
  anniversaryDate?: string;
  message?: string;
}

export interface RespondToMatchRequestRequest {
  status: 'accepted' | 'rejected';
  anniversaryDate?: string;
}

export interface MatchRequestListResponse {
  data: MatchRequestResponse[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

class MatchRequestService {
  /**
   * Send a match request to another user by email
   */
  async sendMatchRequest(data: CreateMatchRequestRequest): Promise<MatchRequestResponse> {
    const response = await apiClient.post<MatchRequestResponse>('/match-requests', data);
    return response.data;
  }

  /**
   * Get sent match requests
   */
  async getSentRequests(status?: string, page: number = 1, limit: number = 10): Promise<MatchRequestListResponse> {
    const response = await apiClient.get<MatchRequestListResponse>('/match-requests/sent', {
      params: {
        status,
        page,
        limit,
      },
    });
    
    return response.data;
  }

  /**
   * Get received match requests
   */
  async getReceivedRequests(status?: string, page: number = 1, limit: number = 10): Promise<MatchRequestListResponse> {
    const response = await apiClient.get<MatchRequestListResponse>('/match-requests/received', {
      params: {
        status,
        page,
        limit,
      },
    });
    
    return response.data;
  }

  /**
   * Get a specific match request by ID
   */
  async getMatchRequest(requestId: string): Promise<MatchRequestResponse> {
    const response = await apiClient.get<ApiResponse<MatchRequestResponse>>(`/match-requests/${requestId}`);
    return response.data.data!;
  }

  /**
   * Respond to a match request (accept or reject)
   */
  async respondToMatchRequest(requestId: string, data: RespondToMatchRequestRequest): Promise<MatchRequestResponse> {
    const response = await apiClient.post<ApiResponse<MatchRequestResponse>>(
      `/match-requests/${requestId}/respond`,
      data
    );
    return response.data.data!;
  }

  /**
   * Cancel a sent match request
   */
  async cancelMatchRequest(requestId: string): Promise<void> {
    await apiClient.delete(`/match-requests/${requestId}`);
  }

  /**
   * Get pending match requests count
   */
  async getPendingCount(): Promise<number> {
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/match-requests/pending-count');
    return response.data.data?.count || 0;
  }

  /**
   * Accept a match request
   */
  async acceptMatchRequest(requestId: string, anniversaryDate?: string): Promise<MatchRequestResponse> {
    return this.respondToMatchRequest(requestId, {
      status: 'accepted',
      anniversaryDate,
    });
  }

  /**
   * Reject a match request
   */
  async rejectMatchRequest(requestId: string): Promise<MatchRequestResponse> {
    return this.respondToMatchRequest(requestId, {
      status: 'rejected',
    });
  }
}

export default new MatchRequestService();
