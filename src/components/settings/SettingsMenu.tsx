
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Languages, Palette, Unlink, Globe, Sun, Moon, Sunset } from "lucide-react";
import { toast } from "sonner";
import { getActiveMatch } from "@/utils/matchUtils";

interface SettingsMenuProps {
  userEmail?: string;
  onUnpair?: () => void;
  onOpenThemeSettings?: () => void;
}

const SettingsMenu = ({ userEmail, onUnpair, onOpenThemeSettings }: SettingsMenuProps) => {
  const [hasActiveMatch, setHasActiveMatch] = useState(() => {
    if (userEmail) {
      const activeMatch = getActiveMatch(userEmail);
      return !!activeMatch;
    }
    return false;
  });

  const handleLanguageChange = (language: string) => {
    const settings = JSON.parse(localStorage.getItem("eralove-settings") || "{}");
    const updatedSettings = { ...settings, language };
    localStorage.setItem("eralove-settings", JSON.stringify(updatedSettings));
    toast.success(`Language changed to ${getLanguageName(language)}`);
  };

  const getLanguageName = (code: string) => {
    const languages = {
      'en': 'English',
      'vi': 'Tiếng Việt',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'zh': '中文'
    };
    return languages[code as keyof typeof languages] || code;
  };

  const handleUnpair = () => {
    if (!userEmail) return;
    
    try {
      const allUsers = JSON.parse(localStorage.getItem("eralove-users") || "[]");
      const allRequests = JSON.parse(localStorage.getItem("eralove-match-requests") || "[]");
      
      const activeMatch = allRequests.find(
        (req) => 
          req.status === 'accepted' && 
          (req.requesterEmail === userEmail || req.recipientEmail === userEmail)
      );
      
      if (activeMatch) {
        const updatedRequests = allRequests.map(req => {
          if (req.id === activeMatch.id) {
            return { ...req, status: 'unpaired' };
          }
          return req;
        });
        
        localStorage.setItem("eralove-match-requests", JSON.stringify(updatedRequests));
        
        const currentUser = allUsers.find(user => user.email === userEmail);
        if (currentUser) {
          delete currentUser.partnerName;
          delete currentUser.anniversaryDate;
          localStorage.setItem("eralove-users", JSON.stringify(allUsers));
          
          const sessionUser = JSON.parse(localStorage.getItem("eralove-user") || "{}");
          if (sessionUser.email === userEmail) {
            delete sessionUser.partnerName;
            delete sessionUser.anniversaryDate;
            localStorage.setItem("eralove-user", JSON.stringify(sessionUser));
          }
        }
        
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
        setHasActiveMatch(false);
        if (onUnpair) {
          onUnpair();
        }
      }
    } catch (error) {
      console.error("Error unpairing:", error);
      toast.error("Failed to unpair. Please try again.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border shadow-lg" align="end">
        <DropdownMenuLabel>App Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          {/* Language Settings */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Languages className="mr-2 h-4 w-4" />
              <span>Language</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-white border shadow-lg">
                <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                  <Globe className="mr-2 h-4 w-4" />
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('vi')}>
                  <Globe className="mr-2 h-4 w-4" />
                  Tiếng Việt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('es')}>
                  <Globe className="mr-2 h-4 w-4" />
                  Español
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('fr')}>
                  <Globe className="mr-2 h-4 w-4" />
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('de')}>
                  <Globe className="mr-2 h-4 w-4" />
                  Deutsch
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('zh')}>
                  <Globe className="mr-2 h-4 w-4" />
                  中文
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {/* Theme Settings */}
          <DropdownMenuItem onClick={onOpenThemeSettings}>
            <Palette className="mr-2 h-4 w-4" />
            <span>Theme & Background</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Unpair Option - Only show if user has an active match */}
        {hasActiveMatch && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem 
                onClick={handleUnpair}
                className="text-destructive focus:text-destructive"
              >
                <Unlink className="mr-2 h-4 w-4" />
                <span>Unpair from Partner</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsMenu;
