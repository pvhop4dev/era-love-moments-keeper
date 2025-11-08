/**
 * Utility functions for avatar URL handling
 */

/**
 * Get the full avatar URL
 * Handles both static chibi avatars and uploaded avatars from backend
 * 
 * @param avatarPath - Avatar path from user profile
 * @returns Full URL to display the avatar
 */
export const getAvatarUrl = (avatarPath: string | undefined): string | undefined => {
  console.log('[avatarUtils] getAvatarUrl called with:', avatarPath);
  
  if (!avatarPath) {
    console.log('[avatarUtils] No avatar path provided, returning undefined');
    return undefined;
  }

  // If it's already a full URL (http:// or https://), return as is
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    console.log('[avatarUtils] Full URL detected, returning as-is:', avatarPath);
    return avatarPath;
  }

  // If it's a static chibi avatar (starts with /lovable-uploads/), return as is
  if (avatarPath.startsWith('/lovable-uploads/')) {
    console.log('[avatarUtils] Static avatar detected, returning as-is:', avatarPath);
    return avatarPath;
  }
  
  // If it's a UI Avatars API URL, return as is
  if (avatarPath.includes('ui-avatars.com')) {
    console.log('[avatarUtils] UI Avatars API URL detected, returning as-is:', avatarPath);
    return avatarPath;
  }

  // If it's an uploaded avatar from backend (e.g., "avatars/userid_timestamp.jpg")
  // Construct the full URL using the API base URL
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
  
  // Remove leading slash if present
  const cleanPath = avatarPath.startsWith('/') ? avatarPath.slice(1) : avatarPath;
  
  // Return the full URL to the file endpoint
  const fullUrl = `${apiBaseUrl}/files/${cleanPath}`;
  console.log('[avatarUtils] Constructed full URL for uploaded avatar:', fullUrl);
  return fullUrl;
};

/**
 * Get user initials for fallback avatar
 * 
 * @param name - User's name
 * @returns First letter of the name in uppercase
 */
export const getUserInitial = (name: string | undefined): string => {
  if (!name) {
    return '?';
  }
  return name.charAt(0).toUpperCase();
};
