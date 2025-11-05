import { useState, useEffect } from 'react';
import { fetchAuthenticatedImage, requiresAuthentication } from '@/utils/imageUtils';

interface AuthenticatedImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: (error: Error) => void;
  fallbackSrc?: string;
}

/**
 * Smart image component that:
 * - Automatically fetches user-uploaded images (/api/v1/files/) with JWT authentication
 * - Displays system images (avatars, placeholders, external URLs) directly without auth
 */
const AuthenticatedImage = ({ 
  src, 
  alt, 
  className = '', 
  onError,
  fallbackSrc 
}: AuthenticatedImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let blobUrl: string | null = null;

    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // fetchAuthenticatedImage will return the URL directly if no auth needed
        // or fetch with auth and return blob URL if auth is required
        const url = await fetchAuthenticatedImage(src);
        
        if (isMounted) {
          blobUrl = url;
          setImageUrl(url);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load image:', err);
        
        if (isMounted) {
          setError(true);
          setLoading(false);
          
          if (onError) {
            onError(err as Error);
          }
        }
      }
    };

    loadImage();

    // Cleanup: revoke blob URL only if it was created (starts with 'blob:')
    return () => {
      isMounted = false;
      if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [src, onError]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
        <span className="text-gray-400 text-xs">Loading...</span>
      </div>
    );
  }

  if (error || !imageUrl) {
    if (fallbackSrc) {
      return <img src={fallbackSrc} alt={alt} className={className} />;
    }
    
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <span className="text-gray-400 text-xs">Failed to load</span>
      </div>
    );
  }

  return (
    <img 
      src={imageUrl} 
      alt={alt} 
      className={className}
      onError={() => {
        setError(true);
        if (onError) {
          onError(new Error('Image failed to render'));
        }
      }}
    />
  );
};

export default AuthenticatedImage;
