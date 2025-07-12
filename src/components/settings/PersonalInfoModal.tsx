
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import AvatarSelector from "@/components/auth/AvatarSelector";

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
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    dateOfBirth: "",
    gender: undefined,
    avatar: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userEmail) {
      // Load user data from localStorage
      const users = JSON.parse(localStorage.getItem("eralove-users") || "[]");
      const currentUser = users.find((user: any) => user.email === userEmail);
      
      if (currentUser) {
        setFormData({
          name: currentUser.name || "",
          email: currentUser.email || "",
          dateOfBirth: currentUser.dateOfBirth || "",
          gender: currentUser.gender,
          avatar: currentUser.avatar || "",
        });
      }
    }
  }, [isOpen, userEmail]);

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
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      // Update users array
      const users = JSON.parse(localStorage.getItem("eralove-users") || "[]");
      const updatedUsers = users.map((user: any) => {
        if (user.email === userEmail) {
          return {
            ...user,
            name: formData.name,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            avatar: formData.avatar,
          };
        }
        return user;
      });
      
      localStorage.setItem("eralove-users", JSON.stringify(updatedUsers));
      
      // Update current user session
      const currentUser = JSON.parse(localStorage.getItem("eralove-user") || "{}");
      if (currentUser.email === userEmail) {
        const updatedCurrentUser = {
          ...currentUser,
          name: formData.name,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          avatar: formData.avatar,
        };
        localStorage.setItem("eralove-user", JSON.stringify(updatedCurrentUser));
      }
      
      toast.success("Personal information updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating personal info:", error);
      toast.error("Failed to update personal information");
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Personal Information</DialogTitle>
          <DialogDescription>
            Update your personal information and profile settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
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
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-3">
            <Label>Gender</Label>
            <RadioGroup value={formData.gender} onValueChange={handleGenderChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male-edit" />
                <Label htmlFor="male-edit">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female-edit" />
                <Label htmlFor="female-edit">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other-edit" />
                <Label htmlFor="other-edit">Other</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Avatar</Label>
            <AvatarSelector 
              onAvatarChange={handleAvatarChange} 
              selectedAvatar={formData.avatar} 
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="love-button">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalInfoModal;
