
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Wallpaper, Languages } from "lucide-react";

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
        }
      } catch (error) {
        console.error("Error parsing settings:", error);
      }
    }
  }, []);

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

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem("eralove-settings", JSON.stringify(settings));
    
    // Apply background image
    applyBackgroundImage(settings.backgroundImage);
    
    toast.success("Settings saved successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-love-700">App Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="backgroundImage" className="flex items-center gap-2">
              <Wallpaper className="h-4 w-4" /> Background Image URL
            </Label>
            <Input
              id="backgroundImage"
              name="backgroundImage"
              value={settings.backgroundImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for default background
            </p>
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
