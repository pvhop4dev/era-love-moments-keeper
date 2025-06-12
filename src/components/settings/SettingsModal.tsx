import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Wallpaper, Languages, Upload, Unlink, Check } from "lucide-react";
import { getActiveMatch } from "@/utils/matchUtils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onUnpair?: () => void;
}

interface Settings {
  backgroundImage: string;
  language: string;
}

const SettingsModal = ({ isOpen, onClose, userEmail, onUnpair }: SettingsModalProps) => {
  const [settings, setSettings] = useState<Settings>({
    backgroundImage: "",
    language: "en",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasActiveMatch, setHasActiveMatch] = useState(false);
  const [selectedBackgroundType, setSelectedBackgroundType] = useState<"default" | "custom" | "upload">("default");
  const [selectedDefaultBg, setSelectedDefaultBg] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default background options with cute couple themes
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
    },
    {
      id: "starry-night",
      name: "Starry Night",
      url: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=1080&fit=crop&auto=format",
      preview: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=150&fit=crop&auto=format"
    },
    {
      id: "forest-path",
      name: "Forest Path",
      url: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=1920&h=1080&fit=crop&auto=format",
      preview: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&h=150&fit=crop&auto=format"
    }
  ];

  useEffect(() => {
    // Load existing settings from localStorage
    const storedSettings = localStorage.getItem("eralove-settings");
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings(parsedSettings);
        
        // Determine background type and apply
        if (parsedSettings.backgroundImage) {
          // Check if it's a default background
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

    // Check if user has an active match
    if (userEmail) {
      const activeMatch = getActiveMatch(userEmail);
      setHasActiveMatch(!!activeMatch);
    }
  }, [userEmail]);

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
    
    // Handle gradient backgrounds differently
    if (url.startsWith('linear-gradient')) {
      document.body.style.backgroundImage = url;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    } else {
      document.body.style.backgroundImage = `url(${url})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedBackgroundType("upload");
      
      // Create a preview URL for the image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setSelectedDefaultBg("");
      
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

  const handleUnpair = () => {
    if (!userEmail) return;
    
    try {
      // Get all users
      const allUsers = JSON.parse(localStorage.getItem("eralove-users") || "[]");
      
      // Get all match requests
      const allRequests = JSON.parse(localStorage.getItem("eralove-match-requests") || "[]");
      
      // Find the active match
      const activeMatch = allRequests.find(
        (req) => 
          req.status === 'accepted' && 
          (req.requesterEmail === userEmail || req.recipientEmail === userEmail)
      );
      
      if (activeMatch) {
        // Update match status to "unpaired"
        const updatedRequests = allRequests.map(req => {
          if (req.id === activeMatch.id) {
            return {
              ...req,
              status: 'unpaired'
            };
          }
          return req;
        });
        
        localStorage.setItem("eralove-match-requests", JSON.stringify(updatedRequests));
        
        // Find the current user and update their partner information
        const currentUser = allUsers.find(user => user.email === userEmail);
        if (currentUser) {
          delete currentUser.partnerName;
          delete currentUser.anniversaryDate;
          localStorage.setItem("eralove-users", JSON.stringify(allUsers));
          
          // Also update current session
          const sessionUser = JSON.parse(localStorage.getItem("eralove-user") || "{}");
          if (sessionUser.email === userEmail) {
            delete sessionUser.partnerName;
            delete sessionUser.anniversaryDate;
            localStorage.setItem("eralove-user", JSON.stringify(sessionUser));
          }
        }
        
        // Find the partner user and update their partner information
        const partnerEmail = activeMatch.requesterEmail === userEmail 
          ? activeMatch.recipientEmail 
          : activeMatch.requesterEmail;
        
        const partnerUser = allUsers.find(user => user.email === partnerEmail);
        if (partnerUser) {
          delete partnerUser.partnerName;
          delete partnerUser.anniversaryDate;
          localStorage.setItem("eralove-users", JSON.stringify(allUsers));
        }
        
        toast.success("You have been unpaired successfully");
        if (onUnpair) {
          onUnpair();
        }
        onClose();
      }
    } catch (error) {
      console.error("Error unpairing:", error);
      toast.error("Failed to unpair. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-love-700">App Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Background Image Settings */}
          <div className="grid gap-4">
            <Label className="flex items-center gap-2 text-lg font-semibold">
              <Wallpaper className="h-5 w-5" /> Background Image
            </Label>
            
            {/* Background Type Selection */}
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

            {/* Default Backgrounds Grid */}
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

            {/* Upload Section */}
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

            {/* Custom URL Section */}
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
            
            <p className="text-xs text-muted-foreground">
              Choose a beautiful background to personalize your love journey
            </p>
          </div>
          
          {/* Language Settings */}
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
          
          {/* Unpair Option - Only show if user has an active match */}
          {hasActiveMatch && (
            <div className="grid gap-2 mt-4 pt-4 border-t border-border">
              <Label className="flex items-center gap-2 text-destructive">
                <Unlink className="h-4 w-4" /> Unpair from Partner
              </Label>
              <p className="text-sm text-muted-foreground">
                This will remove your connection with your current partner. 
                Both of you will return to unpaired state. This action cannot be undone.
              </p>
              <Button 
                variant="destructive" 
                onClick={handleUnpair}
                className="mt-2"
              >
                <Unlink className="h-4 w-4 mr-2" />
                Unpair from Partner
              </Button>
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
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
