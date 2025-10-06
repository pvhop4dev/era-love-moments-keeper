// Export all services for easy import
export { default as authService } from './auth.service';
export { default as userService } from './user.service';
export { default as uploadService } from './upload.service';
export { default as photoService } from './photo.service';
export { default as eventService } from './event.service';
export { default as messageService } from './message.service';
export { default as matchRequestService } from './match-request.service';

// Export types
export type { 
  RegisterRequest, 
  LoginRequest, 
  UserResponse, 
  LoginResponse,
  ApiResponse 
} from './auth.service';

export type { 
  UpdateUserRequest 
} from './user.service';

export type { 
  UploadFileResponse,
  UploadMultipleResponse 
} from './upload.service';

export type { 
  PhotoResponse,
  CreatePhotoRequest,
  UpdatePhotoRequest,
  PhotoListResponse 
} from './photo.service';

export type { 
  EventResponse,
  CreateEventRequest,
  UpdateEventRequest,
  EventListResponse,
  EventFilterParams 
} from './event.service';

export type { 
  MessageResponse,
  CreateMessageRequest,
  MessageListResponse,
  ConversationResponse,
  ConversationListResponse,
  MarkAsReadRequest 
} from './message.service';

export type { 
  MatchRequestResponse,
  CreateMatchRequestRequest,
  RespondToMatchRequestRequest,
  MatchRequestListResponse 
} from './match-request.service';
