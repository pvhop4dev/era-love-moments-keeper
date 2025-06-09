
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Coffee, Tent, Plane, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoveIdea {
  id: string;
  title: string;
  description: string;
  category: 'restaurant' | 'cafe' | 'camping' | 'trip' | 'activity';
  location: string;
  rating?: number;
  price?: string;
  image?: string;
}

interface LoveIdeasProps {
  onSelectIdea?: (idea: LoveIdea) => void;
}

const LoveIdeas = ({ onSelectIdea }: LoveIdeasProps) => {
  const { t } = useLanguage();

  const loveIdeas: LoveIdea[] = [
    {
      id: "idea-1",
      title: "Sunset Rooftop Dinner",
      description: "Romantic dinner with city views and live music",
      category: "restaurant",
      location: "Downtown",
      rating: 4.8,
      price: "$$",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
    },
    {
      id: "idea-2",
      title: "Cozy Coffee Corner",
      description: "Perfect spot for morning dates with artisan coffee",
      category: "cafe",
      location: "Arts District",
      rating: 4.6,
      price: "$",
      image: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd"
    },
    {
      id: "idea-3",
      title: "Lakeside Camping",
      description: "Peaceful camping spot with lake views and hiking trails",
      category: "camping",
      location: "Mountain Lake",
      rating: 4.9,
      price: "$",
      image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7"
    },
    {
      id: "idea-4",
      title: "Weekend Getaway",
      description: "Charming coastal town perfect for romantic weekend",
      category: "trip",
      location: "Coastal Town",
      rating: 4.7,
      price: "$$$",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'restaurant':
        return <Heart className="h-4 w-4" />;
      case 'cafe':
        return <Coffee className="h-4 w-4" />;
      case 'camping':
        return <Tent className="h-4 w-4" />;
      case 'trip':
        return <Plane className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'restaurant':
        return 'bg-love-100 text-love-700';
      case 'cafe':
        return 'bg-amber-100 text-amber-700';
      case 'camping':
        return 'bg-green-100 text-green-700';
      case 'trip':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-love-500" />
          Love Ideas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loveIdeas.map((idea) => (
            <div
              key={idea.id}
              className="group cursor-pointer border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              onClick={() => onSelectIdea?.(idea)}
            >
              {idea.image && (
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={idea.image}
                    alt={idea.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className={`${getCategoryColor(idea.category)} flex items-center gap-1`}>
                      {getCategoryIcon(idea.category)}
                      {idea.category}
                    </Badge>
                  </div>
                  {idea.rating && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      ⭐ {idea.rating}
                    </div>
                  )}
                </div>
              )}
              <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm group-hover:text-love-600 transition-colors">
                    {idea.title}
                  </h3>
                  {idea.price && (
                    <span className="text-xs text-muted-foreground">{idea.price}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{idea.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {idea.location}
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline" className="text-sm">
            View More Ideas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoveIdeas;
