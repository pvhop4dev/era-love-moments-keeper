
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Wallpaper, Languages, Upload } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Settings {
  backgroundImage: string;
  language: string;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [settings, setSettings] = useState<Settings>({
    backgroundImage: "",
    language: "en",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load existing settings from localStorage
    const storedSettings = localStorage.getItem("eralove-settings");
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings(parsedSettings);
        
        // Apply background if exists
        if (parsedSettings.backgroundImage) {
          applyBackgroundImage(parsedSettings.backgroundImage);
          setPreviewUrl(parsedSettings.backgroundImage);
        }
      } catch (error) {
        console.error("Error parsing settings:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Clean up object URLs on unmount
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleLanguageChange = (value: string) => {
    setSettings({
      ...settings,
      language: value,
    });
  };

  const applyBackgroundImage = (url: string) => {
    if (!url) {
      document.body.style.backgroundImage = 
        "radial-gradient(circle at top left, rgba(251, 207, 232, 0.2) 0%, transparent 40%), " +
        "radial-gradient(circle at bottom right, rgba(229, 222, 255, 0.2) 0%, transparent 40%)";
      return;
    }
    
    document.body.style.backgroundImage = `url(${url})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a preview URL for the image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Clear the input URL since we're using a file now
      setSettings({
        ...settings,
        backgroundImage: "",
      });
    }
  };

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const uploadImageToLocalStorage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // Store the data URL in localStorage
          const imageKey = `eralove-bg-${Date.now()}`;
          localStorage.setItem(imageKey, event.target.result as string);
          resolve(event.target.result as string);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    try {
      let backgroundImageUrl = settings.backgroundImage;
      
      // If a file was selected, upload it and get the URL
      if (selectedFile) {
        backgroundImageUrl = await uploadImageToLocalStorage(selectedFile);
      }
      
      // Save settings to localStorage
      const updatedSettings = {
        ...settings,
        backgroundImage: backgroundImageUrl,
      };
      
      localStorage.setItem("eralove-settings", JSON.stringify(updatedSettings));
      
      // Apply background image
      applyBackgroundImage(backgroundImageUrl);
      
      toast.success("Settings saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-love-700">App Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="flex items-center gap-2">
              <Wallpaper className="h-4 w-4" /> Background Image
            </Label>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleSelectFileClick}
                >
                  <Upload className="h-4 w-4" />
                  Upload from device
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Or use URL:</span>
                <Input
                  id="backgroundImage"
                  name="backgroundImage"
                  value={settings.backgroundImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
              </div>
              
              {(previewUrl || settings.backgroundImage) && (
                <div className="mt-2 relative rounded-md overflow-hidden border border-border">
                  <div className="aspect-ratio-16/9 h-40">
                    <img 
                      src={previewUrl || settings.backgroundImage} 
                      alt="Background preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/300x150?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Leave empty for default background
              </p>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="language" className="flex items-center gap-2">
              <Languages className="h-4 w-4" /> Language
            </Label>
            <Select
              value={settings.language}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
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
          <Button onClick={handleSave} className="love-button">
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
