
import { useState, useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  ArrowRight, 
  Heart, 
  Calendar, 
  ImageIcon, 
  MessageSquare, 
  Gift,
  MapPin,
  Smile,
  Music,
  Video,
  FileText,
  MessageCircle,
  Star,
  Clock,
  PinIcon,
  Settings
} from "lucide-react";
import { useCallback } from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import Eri from "@/components/mascot/Eri";

const Welcome = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState<"login" | "register" | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Check if user is already logged in
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  
  // Auto advance carousel
  useEffect(() => {
    const autoAdvanceTimer = setInterval(() => {
      if (api) {
        const nextIndex = (api.selectedScrollSnap() + 1) % count;
        api.scrollTo(nextIndex);
      }
    }, 5000);
    
    return () => clearInterval(autoAdvanceTimer);
  }, [api, count]);

  const features = [
    {
      title: "Track Special Moments",
      description: "Create and save memories of your special days together with beautiful photo albums and AI-powered memory suggestions",
      icon: <Heart className="h-12 w-12 text-love-500 mb-4" />,
      color: "from-love-100 to-love-200",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop&auto=format" // cute couple illustration
    },
    {
      title: "Smart Calendar & Events",
      description: "Never miss important dates with our AI-powered calendar, event suggestions, and automatic anniversary reminders",
      icon: <Calendar className="h-12 w-12 text-couple mb-4" />,
      color: "from-couple-light to-couple",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop&auto=format" // calendar with hearts
    },
    {
      title: "Enhanced Private Messaging",
      description: "Share emojis, stickers, photos, videos, voice messages, locations, polls, quizzes, and schedule messages perfectly",
      icon: <MessageSquare className="h-12 w-12 text-love-600 mb-4" />,
      color: "from-love-200 to-love-300",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop&auto=format" // cute messaging interface
    },
    {
      title: "Interactive Communication",
      description: "Send reactions, create polls and quizzes, pin important messages, star favorites, and reply with love",
      icon: <Smile className="h-12 w-12 text-love-700 mb-4" />,
      color: "from-love-300 to-love-400",
      image: "https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=400&h=200&fit=crop&auto=format" // happy couple communication
    },
    {
      title: "AI-Powered Gift Ideas",
      description: "Get personalized gift suggestions based on your partner's preferences, special occasions, and relationship milestones",
      icon: <Gift className="h-12 w-12 text-couple-dark mb-4" />,
      color: "from-couple to-couple-dark",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=200&fit=crop&auto=format" // cute gift boxes
    },
    {
      title: "Love Journey Map",
      description: "Visualize your relationship milestones, special places, and create an interactive map of your love story together",
      icon: <MapPin className="h-12 w-12 text-love-500 mb-4" />,
      color: "from-love-400 to-love-500",
      image: "https://images.unsplash.com/photo-1471919743851-c4df8b6ee103?w=400&h=200&fit=crop&auto=format" // cute world map with hearts
    }
  ];

  const handleAuthClick = (type: "login" | "register") => {
    setShowAuthForm(type);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center bg-gradient-to-br from-love-50 via-white to-couple-light">
        {/* Hero Section */}
        <div className="text-center mb-12 px-4">
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-love-600 to-couple-dark bg-clip-text text-transparent mb-6">
              EraLove
            </h1>
            <div className="absolute -top-2 -right-4 animate-pulse">
              <Heart className="h-8 w-8 text-love-400 fill-current" />
            </div>
          </div>
          <p className="text-xl md:text-2xl text-love-700 max-w-3xl mx-auto mb-6 leading-relaxed">
            Preserve your precious moments and celebrate your love journey together with AI-powered features
          </p>
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-love-400 to-love-500 border-2 border-white flex items-center justify-center">
                <Heart className="h-5 w-5 text-white fill-current" />
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-couple to-couple-dark border-2 border-white flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-love-500 to-love-600 border-2 border-white flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-love-600 font-medium">Join thousands of couples</span>
          </div>
          {!showAuthForm && (
            <Eri 
              message="Welcome to EraLove! I'm Eri, your personal love messenger. I'll help you create and preserve beautiful memories with your special someone! ✨"
              size="medium"
              className="justify-center"
            />
          )}
        </div>

        {!showAuthForm ? (
          <>
            {/* Features Carousel */}
            <div className="w-full max-w-7xl mb-12 px-4">
              <h2 className="text-3xl font-bold text-center text-love-700 mb-8">
                Everything You Need for Your Love Story
              </h2>
              <Carousel 
                className="w-full"
                setApi={setApi}
                opts={{
                  align: "center",
                  loop: true
                }}
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {features.map((feature, index) => (
                    <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className={`love-card h-full flex flex-col overflow-hidden bg-gradient-to-br ${feature.color} group hover:scale-105 transition-all duration-300 min-h-[400px]`}>
                        {/* Image Section with cute chibi style */}
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={feature.image}
                            alt={feature.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-110 saturate-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-pink-100/30 to-transparent" />
                          <div className="absolute bottom-4 left-4 drop-shadow-lg">
                            {feature.icon}
                          </div>
                          {/* Add cute decorative elements */}
                          <div className="absolute top-2 right-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-love-300 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-couple rounded-full animate-pulse delay-150"></div>
                              <div className="w-2 h-2 bg-love-400 rounded-full animate-pulse delay-300"></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Content Section */}
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold mb-3 text-love-800">
                            {feature.title}
                          </h3>
                          <p className="text-love-700 leading-relaxed flex-grow">
                            {feature.description}
                          </p>
                          
                          {/* Feature Icons */}
                          <div className="flex gap-2 mt-4 pt-4 border-t border-white/20">
                            {index === 2 && (
                              <>
                                <Video className="h-4 w-4 text-love-600" />
                                <Music className="h-4 w-4 text-love-600" />
                                <FileText className="h-4 w-4 text-love-600" />
                                <MapPin className="h-4 w-4 text-love-600" />
                              </>
                            )}
                            {index === 3 && (
                              <>
                                <MessageCircle className="h-4 w-4 text-love-600" />
                                <Star className="h-4 w-4 text-love-600" />
                                <Clock className="h-4 w-4 text-love-600" />
                                <PinIcon className="h-4 w-4 text-love-600" />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                {/* Custom Pagination */}
                <div className="flex justify-center w-full gap-2 mt-8">
                  {Array.from({ length: count }).map((_, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className={`h-3 w-8 rounded-full p-0 transition-all duration-300 ${
                        index === current - 1 
                          ? "bg-love-500 shadow-lg" 
                          : "bg-love-200 hover:bg-love-300"
                      }`}
                      onClick={() => api?.scrollTo(index)}
                    >
                      <span className="sr-only">Go to slide {index + 1}</span>
                    </Button>
                  ))}
                </div>
                <CarouselPrevious className="left-1 sm:left-4 bg-white/80 hover:bg-white" />
                <CarouselNext className="right-1 sm:right-4 bg-white/80 hover:bg-white" />
              </Carousel>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button 
                  onClick={() => handleAuthClick("login")} 
                  className="love-button px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  onClick={() => handleAuthClick("register")}
                  variant="outline" 
                  className="border-2 border-love-400 text-love-600 hover:bg-love-50 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Your Journey
                  <Heart className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
                <p className="text-love-700 font-medium mb-2">
                  🎉 Create an account to track your relationship milestones
                </p>
                <p className="text-love-600">
                  💝 Save memories, share moments, and celebrate your love every day
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-full max-w-md">
              <AuthForm defaultTab={showAuthForm} />
            </div>
            <Button 
              variant="link" 
              onClick={() => setShowAuthForm(null)} 
              className="mt-4 text-love-600 hover:text-love-700"
            >
              ← Back to Home
            </Button>
          </>
        )}
      </div>

      {/* Eraquix Footer */}
      <footer className="bg-gradient-to-r from-love-500 to-couple py-6 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm mb-1">
                &copy; {new Date().getFullYear()} EraLove - Preserving your love story
              </p>
              <p className="text-xs opacity-80">
                A product of Eraquix Solutions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href="https://eraquix.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img 
                  src="/lovable-uploads/85c2ca8f-6d2b-4444-a378-044686d7e2ab.png" 
                  alt="Eraquix Solutions" 
                  className="h-8 w-auto"
                />
                <span className="text-sm font-medium">eraquix.com</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
