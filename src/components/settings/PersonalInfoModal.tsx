
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { User, Edit3, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import AvatarSelector from "@/components/auth/AvatarSelector";
import userService from "@/services/user.service";

interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

interface UserData {
  name: string;
  email: string;
  dateOfBirth: string;
  gender?: "male" | "female" | "other";
  avatar?: string;
}

const PersonalInfoModal = ({ isOpen, onClose, userEmail }: PersonalInfoModalProps) => {
  const { t } = useLanguage();
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    dateOfBirth: "",
    gender: undefined,
    avatar: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUserProfile();
    }
  }, [isOpen]);
  
  const loadUserProfile = async () => {
    setIsFetching(true);
    try {
      const profile = await userService.getProfile();
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: profile.gender as "male" | "female" | "other" | undefined,
        avatar: profile.avatar || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile information");
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenderChange = (value: string) => {
    setFormData({
      ...formData,
      gender: value as "male" | "female" | "other",
    });
  };

  const handleAvatarChange = (avatar: string) => {
    setFormData({
      ...formData,
      avatar,
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.dateOfBirth) {
      toast.error(t('fillRequiredFields'));
      return;
    }

    setIsLoading(true);
    
    try {
      // Update profile via API
      const updatedUser = await userService.updateProfile({
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        avatar: formData.avatar,
      });
      
      // Update auth context
      updateUser(updatedUser);
      
      toast.success(t('personalInfoUpdated'));
      setIsEditingAvatar(false);
      onClose();
    } catch (error) {
      console.error("Error updating personal info:", error);
      toast.error(t('failedUpdatePersonalInfo'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t('personalInformation')}</DialogTitle>
          <DialogDescription>
            {t('updatePersonalInfo')}
          </DialogDescription>
        </DialogHeader>
        
        {isFetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-love-500" />
          </div>
        ) : (
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              name="name"
              placeholder={t('yourName')}
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-gray-100"
            />
            <p className="text-xs text-muted-foreground">{t('emailCannotBeChanged')}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">{t('dateOfBirth')}</Label>
            <DateInput
              id="dateOfBirth"
              name="dateOfBirth"
              required
              value={formData.dateOfBirth}
              onChange={(value) => setFormData({ ...formData, dateOfBirth: value })}
            />
          </div>
          
          <div className="space-y-3">
            <Label>{t('gender')}</Label>
            <RadioGroup value={formData.gender} onValueChange={handleGenderChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male-edit" />
                <Label htmlFor="male-edit">{t('male')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female-edit" />
                <Label htmlFor="female-edit">{t('female')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other-edit" />
                <Label htmlFor="other-edit">{t('other')}</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>{t('avatar')}</Label>
            {!isEditingAvatar ? (
              <div className="flex items-center space-x-3">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={formData.avatar} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditingAvatar(true)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {t('changeAvatar')}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <AvatarSelector 
                  onAvatarChange={handleAvatarChange} 
                  selectedAvatar={formData.avatar} 
                />
                <div className="flex space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditingAvatar(false)}
                  >
                    {t('done')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="love-button">
            {isLoading ? t('saving') : t('saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalInfoModal;
