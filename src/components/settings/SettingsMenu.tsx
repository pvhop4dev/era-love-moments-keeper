
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Settings, Languages, Palette, Unlink, Globe, User, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getActiveMatch } from "@/utils/matchUtils";

interface SettingsMenuProps {
  userEmail?: string;
  onUnpair?: () => void;
  onOpenThemeSettings?: () => void;
  onOpenPersonalInfo?: () => void;
}

const SettingsMenu = ({ userEmail, onUnpair, onOpenThemeSettings, onOpenPersonalInfo }: SettingsMenuProps) => {
  const [hasActiveMatch, setHasActiveMatch] = useState(() => {
    if (userEmail) {
      const activeMatch = getActiveMatch(userEmail);
      return !!activeMatch;
    }
    return false;
  });
  const [confirmText, setConfirmText] = useState("");
  const [isUnpairDialogOpen, setIsUnpairDialogOpen] = useState(false);

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
    if (!userEmail || confirmText !== "unpair") return;
    
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
        setIsUnpairDialogOpen(false);
        setConfirmText("");
        if (onUnpair) {
          onUnpair();
        }
      }
    } catch (error) {
      console.error("Error unpairing:", error);
      toast.error("Failed to unpair. Please try again.");
    }
  };

  const handleUnpairDialogClose = () => {
    setIsUnpairDialogOpen(false);
    setConfirmText("");
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
          {/* Personal Information */}
          <DropdownMenuItem onClick={onOpenPersonalInfo}>
            <User className="mr-2 h-4 w-4" />
            <span>Personal Information</span>
          </DropdownMenuItem>

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
              <AlertDialog open={isUnpairDialogOpen} onOpenChange={setIsUnpairDialogOpen}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    onSelect={(e) => {
                      e.preventDefault();
                      setIsUnpairDialogOpen(true);
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Unlink className="mr-2 h-4 w-4" />
                    <span>Unpair from Partner</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-[425px]">
                  <AlertDialogHeader>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <AlertDialogTitle className="text-destructive">
                        Warning: Unpair from Partner
                      </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-left space-y-3">
                      <p className="font-medium">This action cannot be undone!</p>
                      <p>
                        Unpairing will permanently remove your connection with your partner and delete:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>All shared memories and photos</li>
                        <li>Your anniversary date</li>
                        <li>All couple messages and conversations</li>
                        <li>Your love calendar events</li>
                      </ul>
                      <p className="text-sm font-medium mt-4">
                        To confirm, please type "<span className="font-mono bg-gray-100 px-1 rounded">unpair</span>" below:
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  
                  <div className="py-4">
                    <Input
                      placeholder="Type 'unpair' to confirm"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleUnpairDialogClose}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleUnpair}
                      disabled={confirmText !== "unpair"}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Unpair Partner
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsMenu;
