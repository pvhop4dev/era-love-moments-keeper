
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, BellDot, Heart, Mail, Globe } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user, logout: authLogout, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [hasActiveMatch, setHasActiveMatch] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in via AuthContext
    if (!isAuthenticated || !user) {
      navigate("/", { replace: true });
      return;
    }
    
    setUserData({
      name: user.name,
      email: user.email,
      partnerName: user.partnerName || '',
      anniversaryDate: user.anniversaryDate || '',
    });
    
    // Check if user has an active match from user data
    setHasActiveMatch(!!user.partnerId);
  }, [isAuthenticated, user, navigate]);

  const handleLogout = async () => {
    await authLogout();
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
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
              className="text-white hover:bg-white/20 transition-all duration-200" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20 md:hidden transition-all duration-200" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-gradient-to-br from-love-500 via-couple to-love-600 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 animate-pulse">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div className="absolute top-8 right-12 animate-pulse delay-1000">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <div className="absolute bottom-6 left-16 animate-pulse delay-500">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div className="absolute bottom-4 right-20 animate-pulse delay-700">
            <Heart className="h-3 w-3 text-white" />
          </div>
        </div>
        
        <div className="relative z-10 py-8 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              {/* Brand Section */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <Heart className="h-6 w-6 text-white animate-pulse" />
                  <h3 className="text-xl font-bold">EraLove</h3>
                </div>
                <p className="text-sm opacity-90 leading-relaxed mb-4">
                  Preserving your love story with beautiful memories, meaningful connections, and lasting moments.
                </p>
                <div className="flex justify-center md:justify-start gap-3">
                  <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                    <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                    <Globe className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
              
              {/* Features Section */}
              <div className="text-center">
                <h4 className="font-semibold mb-3 text-lg">Features</h4>
                <ul className="space-y-2 text-sm opacity-90">
                  <li className="hover:opacity-100 transition-opacity cursor-pointer">📅 Love Calendar</li>
                  <li className="hover:opacity-100 transition-opacity cursor-pointer">💌 Couple Messages</li>
                  <li className="hover:opacity-100 transition-opacity cursor-pointer">📸 Memory Albums</li>
                  <li className="hover:opacity-100 transition-opacity cursor-pointer">🗺️ Love Map</li>
                  <li className="hover:opacity-100 transition-opacity cursor-pointer">🎯 Love Suggestions</li>
                </ul>
              </div>
              
              {/* Company Section */}
              <div className="text-center md:text-right">
                <h4 className="font-semibold mb-3 text-lg">Powered By</h4>
                <a 
                  href="https://eraquix.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 hover:opacity-80 transition-all duration-300 group"
                >
                  <img 
                    src="/lovable-uploads/85c2ca8f-6d2b-4444-a378-044686d7e2ab.png" 
                    alt="Eraquix Solutions" 
                    className="h-10 w-auto group-hover:scale-105 transition-transform"
                  />
                  <div className="text-left">
                    <div className="font-medium text-base group-hover:text-white/90">Eraquix Solutions</div>
                    <div className="text-xs opacity-80">eraquix.com</div>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Bottom section */}
            <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm opacity-90">
                  &copy; {new Date().getFullYear()} EraLove - Creating beautiful love stories together
                </p>
              </div>
              
              <div className="flex items-center gap-6 text-xs opacity-80">
                <span className="hover:opacity-100 transition-opacity cursor-pointer">Privacy Policy</span>
                <span className="hover:opacity-100 transition-opacity cursor-pointer">Terms of Service</span>
                <span className="hover:opacity-100 transition-opacity cursor-pointer">Support</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
