/**
 * Check if an image URL requires authentication
 * User-uploaded images from /api/v1/files/ need auth (backend proxies to MinIO)
 * System images (avatars, placeholders, external URLs) don't need auth
 */
export const requiresAuthentication = (imageUrl: string): boolean => {
  // Check if it's a user-uploaded file from our backend API proxy
  // Backend will handle proxying to MinIO with presigned URLs
  return imageUrl.includes('/api/v1/files/');
};

/**
 * Fetch an image with authentication token and return a blob URL
 * This is needed because <img> tags don't send Authorization headers
 */
export const fetchAuthenticatedImage = async (imageUrl: string): Promise<string> => {
  try {
    // If image doesn't require auth, return it directly
    if (!requiresAuthentication(imageUrl)) {
      console.log('[ImageUtils] Image does not require auth:', imageUrl);
      return imageUrl;
    }

    console.log('[ImageUtils] Fetching authenticated image:', imageUrl);
    const token = localStorage.getItem('eralove-token');
    
    if (!token) {
      console.warn('[ImageUtils] No token found for authenticated image fetch');
      throw new Error('Authentication required but no token found');
    }

    console.log('[ImageUtils] Token found, length:', token.length);
    console.log('[ImageUtils] Token preview:', token.substring(0, 30) + '...');

    const response = await fetch(imageUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('[ImageUtils] Fetch response:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    console.log('[ImageUtils] Created blob URL:', blobUrl);
    return blobUrl;
  } catch (error) {
    console.error('[ImageUtils] Error fetching authenticated image:', error);
    throw error;
  }
};

/**
 * Preload multiple images with authentication
 */
export const preloadAuthenticatedImages = async (imageUrls: string[]): Promise<Map<string, string>> => {
  const imageMap = new Map<string, string>();
  
  await Promise.all(
    imageUrls.map(async (url) => {
      try {
        const blobUrl = await fetchAuthenticatedImage(url);
        imageMap.set(url, blobUrl);
      } catch (error) {
        console.error(`Failed to preload image: ${url}`, error);
      }
    })
  );
  
  return imageMap;
};

/**
 * Clean up blob URLs to prevent memory leaks
 */
export const revokeBlobUrls = (blobUrls: string[]) => {
  blobUrls.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
};
