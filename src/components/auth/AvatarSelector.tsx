
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import uploadService from "@/services/upload.service";
import { getAvatarUrl } from "@/utils/avatarUtils";

interface AvatarSelectorProps {
  onAvatarChange: (avatar: string) => void;
  selectedAvatar?: string;
}

const AvatarSelector = ({ onAvatarChange, selectedAvatar }: AvatarSelectorProps) => {
  const [uploadedAvatar, setUploadedAvatar] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Predefined avatar options using UI Avatars API
  // These are generated avatars with different colors and styles
  const avatarOptions = [
    "https://ui-avatars.com/api/?name=Love+1&background=FB7185&color=fff&size=200&bold=true",
    "https://ui-avatars.com/api/?name=Love+2&background=F472B6&color=fff&size=200&bold=true",
    "https://ui-avatars.com/api/?name=Love+3&background=EC4899&color=fff&size=200&bold=true",
    "https://ui-avatars.com/api/?name=Love+4&background=DB2777&color=fff&size=200&bold=true",
    "https://ui-avatars.com/api/?name=Love+5&background=BE185D&color=fff&size=200&bold=true",
    "https://ui-avatars.com/api/?name=Love+6&background=9F1239&color=fff&size=200&bold=true"
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[AvatarSelector] handleFileUpload triggered');
    const file = event.target.files?.[0];
    
    if (!file) {
      console.log('[AvatarSelector] No file selected');
      return;
    }
    
    console.log('[AvatarSelector] File selected:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    setIsUploading(true);
    try {
      console.log('[AvatarSelector] Starting upload...');
      const uploadResult = await uploadService.uploadAvatar(file);
      console.log('[AvatarSelector] Upload successful!');
      console.log('[AvatarSelector] Upload result:', uploadResult);
      console.log('[AvatarSelector] Avatar URL:', uploadResult.url);
      
      setUploadedAvatar(uploadResult.url);
      onAvatarChange(uploadResult.url);
      toast.success("Avatar uploaded successfully");
    } catch (error: any) {
      console.error("[AvatarSelector] Upload failed!");
      console.error("[AvatarSelector] Error details:", error);
      console.error("[AvatarSelector] Error message:", error.message);
      console.error("[AvatarSelector] Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to upload avatar");
    } finally {
      setIsUploading(false);
      console.log('[AvatarSelector] Upload process completed');
    }
  };

  const handleChibiSelect = (avatar: string) => {
    console.log('[AvatarSelector] Chibi avatar selected:', avatar);
    onAvatarChange(avatar);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Avatar className="w-20 h-20 mx-auto mb-2">
          <AvatarImage src={getAvatarUrl(selectedAvatar || uploadedAvatar)} />
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium">Choose an Avatar</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {avatarOptions.map((avatar, index) => (
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
