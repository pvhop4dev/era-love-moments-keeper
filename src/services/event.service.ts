import apiClient from '@/lib/api-client';
import { ApiResponse } from './auth.service';

export interface EventResponse {
  id: string;
  userId: string;
  partnerId?: string;
  title: string;
  description?: string;
  eventDate: string;
  eventTime?: string;
  location?: string;
  eventType?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  eventDate: string;
  eventTime?: string;
  location?: string;
  eventType?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  eventType?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
}

export interface EventListResponse {
  data: EventResponse[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface EventFilterParams {
  page?: number;
  limit?: number;
  partnerId?: string;
  year?: number;
  month?: number;
}

class EventService {
  /**
   * Create a new event
   */
  async createEvent(data: CreateEventRequest): Promise<EventResponse> {
    const response = await apiClient.post<EventResponse>('/events', data);
    return response.data;
  }

  /**
   * Get all events with optional filters
   */
  async getEvents(params: EventFilterParams = {}): Promise<EventListResponse> {
    const { page = 1, limit = 10, partnerId, year, month } = params;
    
    const response = await apiClient.get<EventListResponse>('/events', {
      params: {
        page,
        limit,
        partner_id: partnerId,
        year,
        month,
      },
    });
    
    return response.data;
  }

  /**
   * Get a single event by ID
   */
  async getEvent(eventId: string): Promise<EventResponse> {
    const response = await apiClient.get<ApiResponse<EventResponse>>(`/events/${eventId}`);
    return response.data.data!;
  }

  /**
   * Update an event
   */
  async updateEvent(eventId: string, data: UpdateEventRequest): Promise<EventResponse> {
    const response = await apiClient.put<ApiResponse<EventResponse>>(`/events/${eventId}`, data);
    return response.data.data!;
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId: string): Promise<void> {
    await apiClient.delete(`/events/${eventId}`);
  }

  /**
   * Get events by date range
   */
  async getEventsByDateRange(startDate: string, endDate: string, page: number = 1, limit: number = 10): Promise<EventListResponse> {
    const response = await apiClient.get<EventListResponse>('/events', {
      params: {
        start_date: startDate,
        end_date: endDate,
        page,
        limit,
      },
    });
    
    return response.data;
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(limit: number = 5): Promise<EventListResponse> {
    const response = await apiClient.get<EventListResponse>('/events', {
      params: {
        upcoming: true,
        limit,
      },
    });
    
    return response.data;
  }
}

export default new EventService();
