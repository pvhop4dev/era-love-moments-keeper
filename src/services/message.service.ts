import apiClient from '@/lib/api-client';
import { ApiResponse } from './auth.service';

export interface MessageResponse {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageRequest {
  receiverId: string;
  content: string;
  messageType?: string;
}

export interface MessageListResponse {
  data: MessageResponse[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface ConversationResponse {
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  lastMessage?: MessageResponse;
  unreadCount: number;
}

export interface ConversationListResponse {
  data: ConversationResponse[];
  total: number;
  message?: string;
}

export interface MarkAsReadRequest {
  messageIds: string[];
}

class MessageService {
  /**
   * Send a message to partner
   */
  async sendMessage(data: CreateMessageRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/messages', data);
    return response.data;
  }

  /**
   * Get messages with a specific partner
   */
  async getMessages(partnerId: string, page: number = 1, limit: number = 20): Promise<MessageListResponse> {
    const response = await apiClient.get<MessageListResponse>('/messages', {
      params: {
        partner_id: partnerId,
        page,
        limit,
      },
    });
    
    return response.data;
  }

  /**
   * Get all conversations
   */
  async getConversations(): Promise<ConversationListResponse> {
    const response = await apiClient.get<ConversationListResponse>('/messages/conversations');
    return response.data;
  }

  /**
   * Mark messages as read
   */
  async markAsRead(messageIds: string[]): Promise<void> {
    await apiClient.post('/messages/mark-read', { message_ids: messageIds });
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<void> {
    await apiClient.delete(`/messages/${messageId}`);
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/messages/unread-count');
    return response.data.data?.count || 0;
  }

  /**
   * Search messages
   */
  async searchMessages(query: string, partnerId?: string, page: number = 1, limit: number = 20): Promise<MessageListResponse> {
    const response = await apiClient.get<MessageListResponse>('/messages/search', {
      params: {
        q: query,
        partner_id: partnerId,
        page,
        limit,
      },
    });
    
    return response.data;
  }
}

export default new MessageService();
