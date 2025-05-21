
import { useState } from "react";
import { useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Heart, Calendar, ImageIcon } from "lucide-react";

const Welcome = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showAuthForm, setShowAuthForm] = useState<"login" | "register" | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem("eralove-user");
    if (userData) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const features = [
    {
      title: "Track Special Moments",
      description: "Create and save memories of your special days together",
      icon: <Heart className="h-12 w-12 text-love-500 mb-4" />,
      color: "from-love-100 to-love-200"
    },
    {
      title: "Calendar Events",
      description: "Never miss an important date with our shared calendar",
      icon: <Calendar className="h-12 w-12 text-couple mb-4" />,
      color: "from-couple-light to-couple"
    },
    {
      title: "Photo Albums",
      description: "Store and share beautiful photos of your journey together",
      icon: <ImageIcon className="h-12 w-12 text-love-700 mb-4" />,
      color: "from-love-200 to-love-300"
    }
  ];

  const handleAuthClick = (type: "login" | "register") => {
    setShowAuthForm(type);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-love-50 to-couple-light">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-love-700 mb-2">
          EraLove
        </h1>
        <p className="text-lg text-love-600 max-w-md mx-auto">
          Preserve your precious moments and celebrate your love journey together
        </p>
      </div>

      {!showAuthForm ? (
        <>
          <div className="w-full max-w-4xl mb-8 px-4">
            <Carousel 
              className="w-full"
              opts={{
                align: "center",
                loop: true
              }}
            >
              <CarouselContent>
                {features.map((feature, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className={`love-card h-full flex flex-col items-center text-center p-6 bg-gradient-to-b ${feature.color}`}>
                      {feature.icon}
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-1 sm:left-4" />
              <CarouselNext className="right-1 sm:right-4" />
            </Carousel>
          </div>

          <div className="flex gap-4 mt-4 mb-8">
            <Button 
              onClick={() => handleAuthClick("login")} 
              className="love-button"
            >
              Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => handleAuthClick("register")}
              variant="outline" 
              className="border-love-400 text-love-600 hover:bg-love-50"
            >
              Register
            </Button>
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
            className="mt-4 text-love-600"
          >
            Back to Home
          </Button>
        </>
      )}

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>Create an account to track your relationship milestones,</p>
        <p>save memories, and celebrate your love every day.</p>
      </div>
    </div>
  );
};

export default Welcome;
