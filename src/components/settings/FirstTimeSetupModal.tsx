
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import AvatarSelector from "@/components/auth/AvatarSelector";
import Eri from "@/components/mascot/Eri";
import userService from "@/services/user.service";

interface FirstTimeSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FirstTimeSetupModal = ({ isOpen, onClose }: FirstTimeSetupModalProps) => {
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = (avatar: string) => {
    setSelectedAvatar(avatar);
  };

  const handleComplete = async () => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar");
      return;
    }

    if (!user) return;

    setIsLoading(true);
    
    try {
      // Update user profile with avatar
      const updatedUser = await userService.updateProfile({
        avatar: selectedAvatar,
      });
      
      // Update auth context
      updateUser(updatedUser);
      
      toast.success("Avatar set successfully! Welcome to Eralove! 💕");
      onClose();
    } catch (error) {
      console.error("Error setting avatar:", error);
      toast.error("Failed to set avatar. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    toast.info("You can set your avatar later in Settings");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleSkip()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-center text-2xl">Welcome to Eralove! 💕</DialogTitle>
          <DialogDescription className="text-center">
            Let's personalize your profile by choosing an avatar
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          <Eri 
            message="Hi! I'm so happy you're here! Let's make your profile special by choosing an avatar that represents you! You can always change it later in settings. ✨"
            size="small"
            className="justify-center"
          />
          
          <div className="space-y-2">
            <AvatarSelector 
              onAvatarChange={handleAvatarChange} 
              selectedAvatar={selectedAvatar} 
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleSkip}
            disabled={isLoading}
          >
            Skip for now
          </Button>
          <Button 
            onClick={handleComplete} 
            disabled={isLoading || !selectedAvatar} 
            className="love-button"
          >
            {isLoading ? "Setting avatar..." : "Complete Setup"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FirstTimeSetupModal;
