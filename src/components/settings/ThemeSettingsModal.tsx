
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Wallpaper, Upload, Check } from "lucide-react";

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Settings {
  backgroundImage: string;
}

const ThemeSettingsModal = ({ isOpen, onClose }: ThemeSettingsModalProps) => {
  const [settings, setSettings] = useState<Settings>({
    backgroundImage: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedBackgroundType, setSelectedBackgroundType] = useState<"default" | "custom" | "upload">("default");
  const [selectedDefaultBg, setSelectedDefaultBg] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultBackgrounds = [
    {
      id: "gradient-love",
      name: "Love Gradient",
      url: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #fce7f3 100%)",
      preview: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=150&fit=crop&auto=format"
    },
    {
      id: "sunset-couple",
      name: "Sunset Romance",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&auto=format",
      preview: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=150&fit=crop&auto=format"
    },
    {
      id: "cherry-blossom",
      name: "Cherry Blossom",
      url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&h=1080&fit=crop&auto=format",
      preview: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=300&h=150&fit=crop&auto=format"
    },
    {
      id: "mountain-lake",
      name: "Mountain Lake",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format",
      preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=150&fit=crop&auto=format"
    }
  ];

  useEffect(() => {
    const storedSettings = localStorage.getItem("eralove-settings");
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings(parsedSettings);
        
        if (parsedSettings.backgroundImage) {
          const defaultBg = defaultBackgrounds.find(bg => bg.url === parsedSettings.backgroundImage);
          if (defaultBg) {
            setSelectedBackgroundType("default");
            setSelectedDefaultBg(defaultBg.id);
          } else if (parsedSettings.backgroundImage.startsWith('data:')) {
            setSelectedBackgroundType("upload");
            setPreviewUrl(parsedSettings.backgroundImage);
          } else {
            setSelectedBackgroundType("custom");
          }
          applyBackgroundImage(parsedSettings.backgroundImage);
        }
      } catch (error) {
        console.error("Error parsing settings:", error);
      }
    }
  }, []);

  const applyBackgroundImage = (url: string) => {
    if (!url) {
      document.body.style.backgroundImage = 
        "radial-gradient(circle at top left, rgba(251, 207, 232, 0.2) 0%, transparent 40%), " +
        "radial-gradient(circle at bottom right, rgba(229, 222, 255, 0.2) 0%, transparent 40%)";
      return;
    }
    
    if (url.startsWith('linear-gradient')) {
      document.body.style.backgroundImage = url;
    } else {
      document.body.style.backgroundImage = `url(${url})`;
    }
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedBackgroundType("upload");
      
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setSelectedDefaultBg("");
      
      setSettings({
        ...settings,
        backgroundImage: "",
      });
    }
  };

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleDefaultBackgroundSelect = (backgroundId: string) => {
    setSelectedDefaultBg(backgroundId);
    setSelectedBackgroundType("default");
    setSelectedFile(null);
    setPreviewUrl(null);
    
    const selectedBg = defaultBackgrounds.find(bg => bg.id === backgroundId);
    if (selectedBg) {
      setSettings({
        ...settings,
        backgroundImage: selectedBg.url,
      });
    }
  };

  const handleCustomUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBackgroundType("custom");
    setSelectedDefaultBg("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setSettings({
      ...settings,
      backgroundImage: e.target.value,
    });
  };

  const uploadImageToLocalStorage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
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
      
      if (selectedFile) {
        backgroundImageUrl = await uploadImageToLocalStorage(selectedFile);
      }
      
      const updatedSettings = {
        ...settings,
        backgroundImage: backgroundImageUrl,
      };
      
      localStorage.setItem("eralove-settings", JSON.stringify(updatedSettings));
      applyBackgroundImage(backgroundImageUrl);
      
      toast.success("Theme settings saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-love-700 flex items-center gap-2">
            <Wallpaper className="h-5 w-5" />
            Theme & Background
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <RadioGroup 
            value={selectedBackgroundType} 
            onValueChange={(value: "default" | "custom" | "upload") => setSelectedBackgroundType(value)}
            className="grid grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="default" />
              <Label htmlFor="default" className="cursor-pointer">Default Themes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upload" id="upload" />
              <Label htmlFor="upload" className="cursor-pointer">Upload Image</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="cursor-pointer">Custom URL</Label>
            </div>
          </RadioGroup>

          {selectedBackgroundType === "default" && (
            <div className="grid grid-cols-2 gap-3">
              {defaultBackgrounds.map((bg) => (
                <div
                  key={bg.id}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedDefaultBg === bg.id 
                      ? "border-love-500 ring-2 ring-love-200" 
                      : "border-gray-200 hover:border-love-300"
                  }`}
                  onClick={() => handleDefaultBackgroundSelect(bg.id)}
                >
                  <div className="aspect-[2/1] relative">
                    <img 
                      src={bg.preview}
                      alt={bg.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/300x150?text=" + bg.name;
                      }}
                    />
                    {selectedDefaultBg === bg.id && (
                      <div className="absolute inset-0 bg-love-500/20 flex items-center justify-center">
                        <Check className="h-8 w-8 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-sm font-medium text-center text-gray-700">{bg.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedBackgroundType === "upload" && (
            <div className="space-y-3">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center gap-2"
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
              
              {previewUrl && (
                <div className="relative rounded-md overflow-hidden border border-border">
                  <div className="aspect-[2/1]">
                    <img 
                      src={previewUrl} 
                      alt="Background preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedBackgroundType === "custom" && (
            <div className="space-y-3">
              <Input
                placeholder="https://example.com/image.jpg"
                value={settings.backgroundImage}
                onChange={handleCustomUrlChange}
              />
              
              {settings.backgroundImage && (
                <div className="relative rounded-md overflow-hidden border border-border">
                  <div className="aspect-[2/1]">
                    <img 
                      src={settings.backgroundImage} 
                      alt="Background preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/300x150?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
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
            Save Theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeSettingsModal;
