import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, MapPin, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useLanguage } from "@/contexts/LanguageContext";
import uploadService from "@/services/upload.service";
import photoService from "@/services/photo.service";

export interface PhotoData {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
}

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onSave: (photoData: PhotoData) => void;
  photo?: PhotoData;
}

const PhotoModal = ({ isOpen, onClose, selectedDate, onSave, photo }: PhotoModalProps) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGeocodingLocation, setIsGeocodingLocation] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (photo) {
      setTitle(photo.title);
      setDescription(photo.description);
      setLocation(photo.location || "");
      setCoordinates(photo.coordinates);
      setImageUrl(photo.imageUrl);
      setPreviewUrl(photo.imageUrl);
    } else {
      resetForm();
    }
  }, [photo, isOpen]);
  
  useEffect(() => {
    // Clean up object URLs on unmount or when changed
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setCoordinates(undefined);
    setImageUrl("");
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a preview URL for the image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Clear the input URL since we're using a file now
      setImageUrl("");
    }
  };

  const geocodeLocation = async (locationText: string) => {
    if (!locationText.trim()) return;
    
    setIsGeocodingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const coords = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        setCoordinates(coords);
        toast.success("Location coordinates found!");
      } else {
        toast.error("Location not found. Please try a more specific address.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast.error("Failed to find location coordinates.");
    } finally {
      setIsGeocodingLocation(false);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const locationValue = e.target.value;
    setLocation(locationValue);
    
    // Auto-geocode when user stops typing
    if (locationValue.trim()) {
      const timeoutId = setTimeout(() => {
        geocodeLocation(locationValue);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  };

  const handleSave = async () => {
    // Validate inputs
    if (!title.trim()) {
      toast.error(t('titleRequired'));
      return;
    }
    
    // If we have neither a URL nor a file, show error
    if (!selectedFile) {
      toast.error(t('imageRequired'));
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formattedDate = selectedDate 
        ? selectedDate.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      // Step 1: Get presigned upload URL from backend
      const presignedResponse = await photoService.getPresignedUploadUrl(selectedFile.name);
      console.log('[PhotoModal] Presigned response:', presignedResponse);
      
      // Step 2: Upload file directly to MinIO using presigned URL
      const uploadResponse = await fetch(presignedResponse.uploadUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }
      
      console.log('[PhotoModal] File uploaded to MinIO successfully');
      
      // Step 3: Create photo record with the key from backend
      const photoData = await photoService.createPhoto({
        file_path: presignedResponse.key, // Use key from backend
        title: title.trim(),
        description: description.trim(),
        date: formattedDate,
        location: location || undefined,
        is_private: false,
      });

      // Build correct image URL from backend response
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
      const imageUrl = photoData.imageUrl ? `${apiBaseUrl}/files/${photoData.imageUrl}` : "";

      console.log('[PhotoModal] Photo created:', photoData);
      console.log('[PhotoModal] Image URL:', imageUrl);

      // Convert to local PhotoData format for compatibility
      const localPhotoData: PhotoData = {
        id: photoData.id,
        title: photoData.title,
        description: photoData.description || "",
        date: formattedDate,
        imageUrl: imageUrl,
        location: location || undefined,
        coordinates: coordinates || undefined
      };
      
      onSave(localPhotoData);
      onClose();
      toast.success(photo ? t('photoUpdated') : t('photoAdded'));
    } catch (error) {
      console.error("Error saving photo:", error);
      toast.error(t('errorSavingPhoto'));
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-love-700">
            {photo ? t('editPhoto') : t('addPhoto')}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{t('title')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('enterTitle')}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('enterDescription')}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={location}
                onChange={handleLocationChange}
                placeholder="Enter location where photo was taken"
                className="pl-8"
              />
              {isGeocodingLocation && (
                <div className="absolute right-2 top-2.5">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-love-500 border-t-transparent"></div>
                </div>
              )}
            </div>
            {coordinates && (
              <p className="text-xs text-muted-foreground">
                Coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label>{t('image')}</Label>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleSelectFileClick}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4" />
                  {selectedFile ? selectedFile.name : t('uploadFromDevice')}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              {previewUrl && (
                <div className="mt-2 relative rounded-md overflow-hidden border border-border">
                  <div className="h-40">
                    <img 
                      src={previewUrl} 
                      alt="Image preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/300x150?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isUploading}
            className="border-love-200 hover:bg-love-50"
          >
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} className="love-button" disabled={isUploading}>
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? 'Đang tải lên...' : (photo ? t('updatePhoto') : t('savePhoto'))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoModal;
