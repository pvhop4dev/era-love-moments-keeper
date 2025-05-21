import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, BellDot } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { getActiveMatch, getPendingMatchRequests } from "@/utils/matchUtils";
import MatchNotification from "@/components/match/MatchNotification";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface UserData {
  name: string;
  partnerName: string;
  email: string;
  anniversaryDate: string;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { t } = useLanguage();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [hasActiveMatch, setHasActiveMatch] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("eralove-user");
    
    if (!storedUser) {
      toast.error("Please login to access your love journey");
      navigate("/");
      return;
    }
    
    try {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      
      // Check if user has an active match
      if (parsedUser.email) {
        const activeMatch = getActiveMatch(parsedUser.email);
        setHasActiveMatch(!!activeMatch);
        
        // Check for pending match requests
        const requests = getPendingMatchRequests(parsedUser.email);
        setPendingRequests(requests.length);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      toast.error("Error loading your profile");
      navigate("/");
    }
    
    // Check for custom background
    const storedSettings = localStorage.getItem("eralove-settings");
    if (storedSettings) {
      try {
        const { backgroundImage } = JSON.parse(storedSettings);
        if (backgroundImage) {
          document.body.style.backgroundImage = `url(${backgroundImage})`;
          document.body.style.backgroundSize = "cover";
          document.body.style.backgroundPosition = "center";
          document.body.style.backgroundAttachment = "fixed";
        }
      } catch (error) {
        console.error("Error loading background settings:", error);
      }
    }
    
    // Check for new requests periodically
    const interval = setInterval(() => {
      if (userData?.email) {
        const requests = getPendingMatchRequests(userData.email);
        setPendingRequests(requests.length);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [navigate, userData?.email]);

  const handleLogout = () => {
    localStorage.removeItem("eralove-user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">Loading your love journey...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-love-500 to-couple py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-lg">EraLove</span>
            {!hasActiveMatch && pendingRequests > 0 && (
              <div className="relative">
                <BellDot className="h-5 w-5 text-white" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground">
                  {pendingRequests}
                </Badge>
              </div>
            )}
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-white">
            <div className="text-right">
              <p className="text-sm opacity-80">{hasActiveMatch ? t('welcome') : "Not Connected"}</p>
              <p className="font-medium">
                {hasActiveMatch ? (
                  <>
                    {userData.name} & {userData.partnerName}
                  </>
                ) : (
                  userData.name
                )}
              </p>
            </div>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20 md:hidden" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-gradient-to-r from-love-500 to-couple py-3 text-white text-center text-sm">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} EraLove - Preserving your love story
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
