
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import uploadService from "@/services/upload.service";

interface AvatarSelectorProps {
  onAvatarChange: (avatar: string) => void;
  selectedAvatar?: string;
}

const AvatarSelector = ({ onAvatarChange, selectedAvatar }: AvatarSelectorProps) => {
  const [uploadedAvatar, setUploadedAvatar] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Predefined chibi avatars
  const chibiAvatars = [
    "/lovable-uploads/chibi-1.png",
    "/lovable-uploads/chibi-2.png", 
    "/lovable-uploads/chibi-3.png",
    "/lovable-uploads/chibi-4.png",
    "/lovable-uploads/chibi-5.png",
    "/lovable-uploads/chibi-6.png"
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // Upload to server
        const uploadResult = await uploadService.uploadAvatar(file);
        setUploadedAvatar(uploadResult.url);
        onAvatarChange(uploadResult.url);
        toast.success("Avatar uploaded successfully");
      } catch (error) {
        console.error("Error uploading avatar:", error);
        toast.error("Failed to upload avatar");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleChibiSelect = (avatar: string) => {
    onAvatarChange(avatar);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Avatar className="w-20 h-20 mx-auto mb-2">
          <AvatarImage src={selectedAvatar || uploadedAvatar} />
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium">Choose a Chibi Character</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {chibiAvatars.map((avatar, index) => (
              <button
                key={index}
                type="button"
                className={`relative p-1 rounded-lg border-2 transition-colors ${
                  selectedAvatar === avatar
                    ? "border-love-500 bg-love-50"
                    : "border-gray-200 hover:border-love-300"
                }`}
                onClick={() => handleChibiSelect(avatar)}
              >
                <Avatar className="w-full h-auto aspect-square">
                  <AvatarImage src={avatar} className="object-cover" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Label className="text-sm font-medium">Or Upload Your Own</Label>
          <div className="mt-2">
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <Button type="button" variant="outline" className="w-full" asChild disabled={isUploading}>
                <span>
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </>
                  )}
                </span>
              </Button>
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
