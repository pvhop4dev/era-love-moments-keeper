# Avatar Loading and Saving Fix

## Problem
Avatar images were not loading properly due to inconsistent URL handling between:
1. Static chibi avatars (e.g., `/lovable-uploads/chibi-1.png`)
2. User-uploaded avatars from backend (e.g., `avatars/userid_timestamp.jpg`)

## Root Cause
- Backend returns relative paths for uploaded avatars (e.g., `avatars/userid_timestamp.jpg`)
- Frontend was using these paths directly without constructing full URLs
- Static chibi avatars use different path format (`/lovable-uploads/`)
- No unified handling for different avatar types

## Solution

### 1. Created Avatar Utility (`/src/utils/avatarUtils.ts`)

```typescript
export const getAvatarUrl = (avatarPath: string | undefined): string | undefined => {
  if (!avatarPath) return undefined;
  
  // Already full URL
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }
  
  // Static chibi avatar
  if (avatarPath.startsWith('/lovable-uploads/')) {
    return avatarPath;
  }
  
  // Uploaded avatar - construct full URL
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
  const cleanPath = avatarPath.startsWith('/') ? avatarPath.slice(1) : avatarPath;
  return `${apiBaseUrl}/files/${cleanPath}`;
};
```

### 2. Updated Components

#### Dashboard.tsx
- Import `getAvatarUrl` and `getUserInitial`
- Use `getAvatarUrl(user?.avatar)` instead of `user.avatar` directly
- Add error handling with fallback to initials

```typescript
{getAvatarUrl(user?.avatar) ? (
  <img 
    src={getAvatarUrl(user?.avatar)} 
    alt={user?.name}
    className="w-12 h-12 rounded-full object-cover border-2 border-love-300"
    onError={(e) => {
      // Fallback to initial if image fails to load
      e.currentTarget.style.display = 'none';
      e.currentTarget.nextElementSibling?.classList.remove('hidden');
    }}
  />
) : null}
<div className={`w-12 h-12 rounded-full bg-love-100 flex items-center justify-center border-2 border-love-300 ${getAvatarUrl(user?.avatar) ? 'hidden' : ''}`}>
  <span className="text-love-600 font-semibold text-lg">
    {getUserInitial(user?.name)}
  </span>
</div>
```

#### AvatarSelector.tsx
- Import `getAvatarUrl`
- Use utility for preview display
- Add console logging for debugging

#### FirstTimeSetupModal.tsx
- Add console logging to track avatar save process
- Log selected avatar, API call, and response

### 3. Avatar Types Handled

1. **Static Chibi Avatars**
   - Path: `/lovable-uploads/chibi-X.png`
   - Handling: Return as-is (served from public folder)

2. **Uploaded Avatars**
   - Path from backend: `avatars/userid_timestamp.jpg`
   - Handling: Construct full URL `http://localhost:8080/api/v1/files/avatars/userid_timestamp.jpg`

3. **Full URLs**
   - Path: `http://example.com/avatar.jpg`
   - Handling: Return as-is

### 4. Error Handling

- Image load error triggers fallback to user initials
- Graceful degradation if avatar URL is invalid
- Console logging for debugging

## Testing Checklist

- [ ] Chibi avatar selection works
- [ ] Chibi avatar displays correctly after save
- [ ] Custom avatar upload works
- [ ] Custom avatar displays correctly after save
- [ ] Avatar persists after page reload
- [ ] Avatar displays in Dashboard welcome section
- [ ] Fallback to initials works when image fails
- [ ] Console logs show correct avatar URLs

## Debug Steps

1. Open browser console
2. Select/upload an avatar
3. Check logs:
   - `[AvatarSelector] Chibi avatar selected:` or `[AvatarSelector] Upload result:`
   - `[FirstTimeSetupModal] Saving avatar:`
   - `[FirstTimeSetupModal] Updated user avatar:`
4. Verify avatar URL format
5. Check if image loads in Network tab

## Files Modified

- ✅ `/src/utils/avatarUtils.ts` - New utility file
- ✅ `/src/pages/Dashboard.tsx` - Use avatar utility
- ✅ `/src/components/auth/AvatarSelector.tsx` - Use utility + logging
- ✅ `/src/components/settings/FirstTimeSetupModal.tsx` - Add logging

## Backend Considerations

Backend should return avatar URLs in one of these formats:
1. Relative path: `avatars/userid_timestamp.jpg`
2. Full URL: `http://localhost:8080/api/v1/files/avatars/userid_timestamp.jpg`

Frontend now handles both cases correctly.
