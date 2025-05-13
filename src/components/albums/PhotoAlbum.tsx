
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface PhotoAlbumProps {
  eventTitle: string;
  eventDate: string;
  images: string[];
}

const PhotoAlbum = ({ eventTitle, eventDate, images }: PhotoAlbumProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const openImageViewer = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: "next" | "prev") => {
    if (images.length <= 1) return;
    
    let newIndex;
    if (direction === "next") {
      newIndex = (currentImageIndex + 1) % images.length;
    } else {
      newIndex = (currentImageIndex - 1 + images.length) % images.length;
    }
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  return (
    <>
      <Card className="love-card h-full">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <ImageIcon className="h-5 w-5 text-love-500" />
            Photo Album: {eventTitle}
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            {new Date(eventDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </CardHeader>
        <CardContent>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-all hover:shadow-md"
                  onClick={() => openImageViewer(image, index)}
                >
                  <img 
                    src={image} 
                    alt={`Memory ${index + 1}`} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x400?text=Image+Not+Found";
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>No photos added to this event yet</p>
              <p className="text-sm">Add image URLs in the event details</p>
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
              {images.length > 1 && (
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
            
            <img 
              src={selectedImage || ""} 
              alt="Selected memory"
              className="max-h-[80vh] mx-auto object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/800x600?text=Image+Not+Found";
              }}
            />
            
            <div className="bg-background/90 p-2 text-center">
              <p className="font-medium">{eventTitle}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(eventDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoAlbum;
