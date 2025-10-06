# EraLove Frontend Services

Thư mục này chứa tất cả các service layers để giao tiếp với backend API.

## Cấu trúc

```
services/
├── index.ts                    # Export tất cả services và types
├── auth.service.ts             # Authentication & Authorization
├── user.service.ts             # User profile management
├── photo.service.ts            # Photo upload & management
├── event.service.ts            # Event/Milestone management
├── message.service.ts          # Private messaging
└── match-request.service.ts    # Match request between couples
```

## Services Overview

### 1. Auth Service (`auth.service.ts`)
Xử lý authentication và authorization.

**Methods:**
- `register(data)` - Đăng ký user mới
- `login(data)` - Đăng nhập
- `logout(refreshToken?)` - Đăng xuất
- `getCurrentUser()` - Lấy user hiện tại từ localStorage
- `isAuthenticated()` - Kiểm tra authentication status
- `getToken()` - Lấy JWT token

**Usage:**
```typescript
import { authService } from '@/services';

// Register
const user = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  dateOfBirth: '1990-01-01',
  gender: 'male',
});

// Login
const response = await authService.login({
  email: 'john@example.com',
  password: 'password123',
});
```

### 2. User Service (`user.service.ts`)
Quản lý user profile.

**Methods:**
- `getProfile()` - Lấy profile của user hiện tại
- `updateProfile(data)` - Cập nhật profile
- `deleteAccount()` - Xóa tài khoản

**Usage:**
```typescript
import { userService } from '@/services';

// Get profile
const profile = await userService.getProfile();

// Update profile
const updated = await userService.updateProfile({
  name: 'Jane Doe',
  avatar: 'https://...',
});
```

### 3. Photo Service (`photo.service.ts`)
Upload và quản lý photos.

**Methods:**
- `createPhoto(data)` - Upload photo mới (multipart/form-data)
- `getPhotos(page, limit)` - Lấy danh sách photos
- `getPhoto(photoId)` - Lấy chi tiết 1 photo
- `updatePhoto(photoId, data)` - Cập nhật photo metadata
- `deletePhoto(photoId)` - Xóa photo
- `getPhotosByTags(tags, page, limit)` - Lấy photos theo tags

**Usage:**
```typescript
import { photoService } from '@/services';

// Upload photo
const photo = await photoService.createPhoto({
  file: fileObject,
  title: 'Beach Vacation',
  description: 'Summer 2025',
  tags: ['vacation', 'beach'],
});

// Get photos
const { data, total } = await photoService.getPhotos(1, 10);
```

### 4. Event Service (`event.service.ts`)
Tạo và quản lý events/milestones.

**Methods:**
- `createEvent(data)` - Tạo event mới
- `getEvents(params)` - Lấy danh sách events (có filters)
- `getEvent(eventId)` - Lấy chi tiết 1 event
- `updateEvent(eventId, data)` - Cập nhật event
- `deleteEvent(eventId)` - Xóa event
- `getEventsByDateRange(startDate, endDate, page, limit)` - Lấy events theo khoảng thời gian
- `getUpcomingEvents(limit)` - Lấy events sắp tới

**Usage:**
```typescript
import { eventService } from '@/services';

// Create event
const event = await eventService.createEvent({
  title: 'Anniversary Dinner',
  description: 'Our special day',
  eventDate: '2025-10-15',
  eventTime: '19:00',
  location: 'The French Bistro',
  eventType: 'anniversary',
});

// Get events with filters
const { data } = await eventService.getEvents({
  year: 2025,
  month: 10,
  page: 1,
  limit: 10,
});
```

### 5. Message Service (`message.service.ts`)
Gửi và nhận messages với partner.

**Methods:**
- `sendMessage(data)` - Gửi message
- `getMessages(partnerId, page, limit)` - Lấy messages với partner
- `getConversations()` - Lấy danh sách conversations
- `markAsRead(messageIds)` - Đánh dấu messages đã đọc
- `deleteMessage(messageId)` - Xóa message
- `getUnreadCount()` - Lấy số lượng messages chưa đọc
- `searchMessages(query, partnerId?, page, limit)` - Tìm kiếm messages

**Usage:**
```typescript
import { messageService } from '@/services';

// Send message
const message = await messageService.sendMessage({
  receiverId: 'partner-id',
  content: 'Hello my love!',
  messageType: 'text',
});

// Get messages
const { data } = await messageService.getMessages('partner-id', 1, 20);

// Get conversations
const conversations = await messageService.getConversations();
```

### 6. Match Request Service (`match-request.service.ts`)
Gửi và quản lý match requests giữa couples.

**Methods:**
- `sendMatchRequest(data)` - Gửi match request
- `getSentRequests(status?, page, limit)` - Lấy requests đã gửi
- `getReceivedRequests(status?, page, limit)` - Lấy requests nhận được
- `getMatchRequest(requestId)` - Lấy chi tiết 1 request
- `respondToMatchRequest(requestId, data)` - Accept/Reject request
- `cancelMatchRequest(requestId)` - Hủy request
- `getPendingCount()` - Lấy số lượng pending requests
- `acceptMatchRequest(requestId, anniversaryDate?)` - Helper để accept
- `rejectMatchRequest(requestId)` - Helper để reject

**Usage:**
```typescript
import { matchRequestService } from '@/services';

// Send match request
const request = await matchRequestService.sendMatchRequest({
  receiverEmail: 'partner@example.com',
  anniversaryDate: '2020-01-01',
  message: 'Let\'s track our love journey!',
});

// Get received requests
const { data } = await matchRequestService.getReceivedRequests('pending');

// Accept request
await matchRequestService.acceptMatchRequest('request-id', '2020-01-01');

// Reject request
await matchRequestService.rejectMatchRequest('request-id');
```

## Import Pattern

### Import single service:
```typescript
import authService from '@/services/auth.service';
```

### Import multiple services:
```typescript
import { authService, userService, photoService } from '@/services';
```

### Import with types:
```typescript
import { 
  photoService, 
  type PhotoResponse, 
  type CreatePhotoRequest 
} from '@/services';
```

## Error Handling

Tất cả services đều throw errors khi có lỗi. Nên wrap trong try-catch:

```typescript
import { photoService } from '@/services';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

try {
  const photo = await photoService.createPhoto(data);
  toast.success('Photo uploaded!');
} catch (error) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || 'Upload failed';
    toast.error(message);
  } else {
    toast.error('An unexpected error occurred');
  }
}
```

## Authentication

Tất cả protected endpoints tự động có JWT token trong headers nhờ axios interceptor trong `api-client.ts`. Không cần thêm token manually.

## Response Format

### Success Response:
```typescript
{
  data: T,           // Response data
  message?: string   // Optional success message
}
```

### List Response:
```typescript
{
  data: T[],         // Array of items
  total: number,     // Total count
  page: number,      // Current page
  limit: number,     // Items per page
  message?: string
}
```

### Error Response:
```typescript
{
  error: string,     // Error type
  message: string,   // Error message
  details?: any      // Optional error details
}
```

## Best Practices

1. **Always handle errors**: Wrap service calls in try-catch
2. **Show user feedback**: Use toast notifications
3. **Loading states**: Show loading indicators during API calls
4. **Optimistic updates**: Update UI before API response (optional)
5. **Cache responses**: Consider using React Query or SWR
6. **Type safety**: Import and use TypeScript types

## Example Component

```typescript
import { useState } from 'react';
import { photoService, type PhotoResponse } from '@/services';
import { toast } from 'sonner';

export const PhotoUploader = () => {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<PhotoResponse[]>([]);

  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      const photo = await photoService.createPhoto({
        file,
        title: file.name,
        tags: ['upload'],
      });
      
      setPhotos(prev => [photo, ...prev]);
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your component JSX
  );
};
```
