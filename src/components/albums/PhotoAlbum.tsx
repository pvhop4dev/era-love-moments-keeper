
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { PhotoData } from "@/components/photos/PhotoModal";
import { useLanguage } from "@/contexts/LanguageContext";
import AuthenticatedImage from "@/components/common/AuthenticatedImage";

interface PhotoAlbumProps {
  photos: PhotoData[];
  onSelectPhoto: (photo: PhotoData) => void;
}

const PhotoAlbum = ({ photos, onSelectPhoto }: PhotoAlbumProps) => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  const openImageViewer = (photo: PhotoData, index: number) => {
    setSelectedImage(photo.imageUrl);
    setCurrentPhotoIndex(index);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: "next" | "prev") => {
    if (photos.length <= 1) return;
    
    let newIndex;
    if (direction === "next") {
      newIndex = (currentPhotoIndex + 1) % photos.length;
    } else {
      newIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    }
    
    setCurrentPhotoIndex(newIndex);
    setSelectedImage(photos[newIndex].imageUrl);
  };

  return (
    <>
      <Card className="love-card h-full">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <ImageIcon className="h-5 w-5 text-love-500" />
            {t('photoAlbum')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo, index) => (
                <div 
                  key={photo.id} 
                  className="relative group"
                >
                  <div 
                    className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-all hover:shadow-md"
                    onClick={() => openImageViewer(photo, index)}
                  >
                    <AuthenticatedImage
                      src={photo.imageUrl} 
                      alt={photo.title} 
                      className="h-full w-full object-cover"
                      fallbackSrc="https://via.placeholder.com/400x400?text=Image+Not+Found"
                    />
                  </div>
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm truncate rounded-b-lg"
                    onClick={() => onSelectPhoto(photo)}
                  >
                    {photo.title}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>{t('noPhotos')}</p>
              <p className="text-sm">{t('addPhoto')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Viewer Modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && closeImageViewer()}>
        <DialogContent className="sm:max-w-[800px] p-1">
          <div className="relative">
            <Button 
              variant="ghost" 
              className="absolute top-2 right-2 z-10 rounded-full bg-background/80 p-2 h-8 w-8"
              onClick={closeImageViewer}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="flex justify-between items-center absolute top-1/2 transform -translate-y-1/2 w-full px-2 z-10">
              {photos.length > 1 && (
                <>
                  <Button 
                    variant="ghost" 
                    className="rounded-full bg-background/80 p-2 h-8 w-8"
                    onClick={() => navigateImage("prev")}
                  >
                    &lt;
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="rounded-full bg-background/80 p-2 h-8 w-8"
                    onClick={() => navigateImage("next")}
                  >
                    &gt;
                  </Button>
                </>
              )}
            </div>
            
            {selectedImage && (
              <AuthenticatedImage
                src={selectedImage} 
                alt="Selected memory"
                className="max-h-[80vh] mx-auto object-contain rounded-lg"
                fallbackSrc="https://via.placeholder.com/800x600?text=Image+Not+Found"
              />
            )}
            
            {currentPhotoIndex >= 0 && photos[currentPhotoIndex] && (
              <div className="bg-background/90 p-2 text-center">
                <p className="font-medium">{photos[currentPhotoIndex].title}</p>
                <p className="text-sm text-muted-foreground">
                  {photos[currentPhotoIndex].description}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoAlbum;
