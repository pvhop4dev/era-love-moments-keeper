# Avatar Upload Debug Guide

## Bước 1: Kiểm tra Upload Button

1. Mở FirstTimeSetupModal hoặc PersonalInfoModal
2. Click "Upload Photo" button
3. Chọn một file ảnh
4. Xem console logs

### Expected Logs:
```
[AvatarSelector] Uploading avatar file: filename.jpg
[UploadService] uploadFile called: {fileName: "...", fileSize: ..., folder: "avatars"}
[UploadService] Sending upload request to /upload...
[UploadService] Upload response: {filePath: "...", url: "..."}
[UploadService] File URL: http://localhost:8080/api/v1/files/avatars/...
[AvatarSelector] Upload result: {...}
[AvatarSelector] Avatar URL: http://localhost:8080/api/v1/files/avatars/...
```

## Bước 2: Kiểm tra Network Tab

1. Mở DevTools → Network tab
2. Upload một ảnh
3. Tìm request đến `/api/v1/upload`
4. Kiểm tra:
   - **Status**: Phải là 200 OK
   - **Request Headers**: Content-Type: multipart/form-data
   - **Request Payload**: File và folder=avatars
   - **Response**: JSON với url field

### Nếu Status 401 (Unauthorized):
- Token không hợp lệ hoặc hết hạn
- Kiểm tra localStorage có `eralove-token` không

### Nếu Status 400 (Bad Request):
- File quá lớn
- File type không được support
- Missing required fields

### Nếu Status 500 (Internal Server Error):
- Backend error
- Kiểm tra backend logs
- MinIO connection issue

## Bước 3: Kiểm tra Backend Logs

Backend sẽ log:
```
[INFO] Upload file - user_id: xxx, filename: xxx, size: xxx, folder: avatars
[INFO] Upload file - file_path: avatars/userid_timestamp.jpg, url: xxx
```

### Nếu không thấy logs:
- Request không đến backend
- CORS issue
- Network issue

### Nếu có error logs:
- MinIO connection failed
- File validation failed
- Storage service error

## Bước 4: Kiểm tra MinIO

1. Mở MinIO Console: http://localhost:9001
2. Login với credentials từ docker-compose
3. Kiểm tra bucket `eralove`
4. Tìm folder `avatars/`
5. Xem file có được upload không

### Nếu không thấy file:
- MinIO service không chạy
- Bucket không tồn tại
- Permission issue

## Bước 5: Kiểm tra Avatar Display

Sau khi upload thành công:

1. Avatar URL được lưu vào database
2. User object được update
3. AuthContext được refresh
4. Dashboard hiển thị avatar

### Expected Console Logs:
```
[FirstTimeSetupModal] Saving avatar: http://localhost:8080/api/v1/files/avatars/...
[UserService] updateProfile called with data: {avatar: "http://..."}
[UserService] Updated user avatar: http://localhost:8080/api/v1/files/avatars/...
[AuthContext] updateUser called with: {avatar: "http://..."}
[Dashboard] User avatar from API: http://localhost:8080/api/v1/files/avatars/...
[avatarUtils] getAvatarUrl called with: http://localhost:8080/api/v1/files/avatars/...
[avatarUtils] Full URL detected, returning as-is: http://localhost:8080/api/v1/files/avatars/...
```

## Common Issues & Solutions

### Issue 1: Upload button không hoạt động
**Solution**: 
- Kiểm tra file input có được trigger không
- Kiểm tra `isUploading` state
- Xem có error trong console không

### Issue 2: Upload thành công nhưng không hiển thị
**Solution**:
- Kiểm tra `onAvatarChange` có được gọi không
- Kiểm tra `selectedAvatar` state
- Kiểm tra `updateUser` có được gọi không

### Issue 3: Avatar hiển thị broken image
**Solution**:
- Kiểm tra URL format
- Kiểm tra file có tồn tại trong MinIO không
- Kiểm tra CORS headers
- Kiểm tra authentication token

### Issue 4: 401 Unauthorized
**Solution**:
```javascript
// Check token in console
console.log('Token:', localStorage.getItem('eralove-token'));

// If no token, login again
// If token expired, refresh token
```

### Issue 5: MinIO connection failed
**Solution**:
```bash
# Check MinIO is running
docker ps | grep minio

# Check MinIO logs
docker logs eralove-minio

# Restart MinIO
docker-compose restart minio
```

## Quick Test Script

Paste this in browser console to test upload:

```javascript
// Test file upload
const testUpload = async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    console.log('File selected:', file.name);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'avatars');
    
    const token = localStorage.getItem('eralove-token');
    
    try {
      const response = await fetch('http://localhost:8080/api/v1/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      console.log('Upload response:', data);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };
  
  input.click();
};

testUpload();
```

## Checklist

- [ ] Console shows upload logs
- [ ] Network tab shows 200 OK response
- [ ] Backend logs show upload success
- [ ] MinIO shows uploaded file
- [ ] Database has avatar URL
- [ ] Dashboard displays avatar
- [ ] No console errors
- [ ] Image loads without 404

## Next Steps

If upload still doesn't work after checking all above:

1. Share console logs
2. Share network tab screenshot
3. Share backend logs
4. Share MinIO bucket screenshot
5. Check if using correct API endpoint
6. Verify MinIO credentials in backend config
