
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Image as ImageIcon, Trash } from "lucide-react";

export interface PhotoData {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
}

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onSave: (photoData: PhotoData) => void;
  photo?: PhotoData;
}

const PhotoModal = ({ isOpen, onClose, selectedDate, onSave, photo }: PhotoModalProps) => {
  const [photoData, setPhotoData] = useState<PhotoData>({
    id: "",
    title: "",
    date: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (selectedDate) {
      setPhotoData((prev) => ({
        ...prev,
        date: selectedDate.toISOString().split("T")[0],
      }));
    }
    
    if (photo) {
      setPhotoData(photo);
    } else {
      // Generate a unique ID for new photos
      setPhotoData((prev) => ({
        ...prev,
        id: `photo-${Date.now()}`,
      }));
    }
  }, [selectedDate, photo, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPhotoData({
      ...photoData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (!photoData.title) {
      toast.error("Please enter a photo title");
      return;
    }

    if (!photoData.imageUrl) {
      toast.error("Please enter an image URL");
      return;
    }

    onSave(photoData);
    toast.success(`Photo ${photo ? "updated" : "added"} successfully!`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-love-700 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-love-500" />
            {photo ? "Edit Photo" : "Add New Photo"}
          </DialogTitle>
          <DialogDescription>
            {selectedDate
              ? `Add a photo memory for ${selectedDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}`
              : "Add a new photo to your love journey"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={photoData.title}
              onChange={handleChange}
              placeholder="Our beach sunset, First kiss, etc."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={photoData.description}
              onChange={handleChange}
              placeholder="Write about this special photo..."
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={photoData.date}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={photoData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/your-image.jpg"
            />
            {photoData.imageUrl && (
              <div className="mt-2 aspect-video rounded-md overflow-hidden bg-gray-100">
                <img 
                  src={photoData.imageUrl} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-love-200 hover:bg-love-50"
          >
            Cancel
          </Button>
          {photo && (
            <Button 
              variant="destructive" 
              className="flex items-center gap-1"
              onClick={() => {
                // This would handle delete in a real app
                toast.success("Photo deleted successfully!");
                onClose();
              }}
            >
              <Trash className="h-4 w-4" />
              Delete
            </Button>
          )}
          <Button onClick={handleSave} className="love-button">
            {photo ? "Update" : "Add"} Photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoModal;
