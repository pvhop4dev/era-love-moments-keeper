
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star, Gift, Heart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  rating: number;
  category: "gifts" | "experiences" | "jewelry" | "tech";
  affiliateLink: string;
  imageUrl: string;
}

interface AffiliateProductsProps {
  category?: "birthday" | "anniversary" | "valentine" | "general";
  limit?: number;
}

const AffiliateProducts = ({ category = "general", limit = 3 }: AffiliateProductsProps) => {
  // Sample affiliate products - in a real app, these would come from your affiliate network
  const products: Product[] = [
    {
      id: "1",
      name: "Personalized Photo Album",
      description: "Create beautiful memories with a custom photo album for your special moments together.",
      price: "$29.99",
      originalPrice: "$39.99",
      rating: 4.8,
      category: "gifts",
      affiliateLink: "https://example.com/affiliate/photo-album",
      imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0"
    },
    {
      id: "2",
      name: "Couples Spa Experience",
      description: "Relax and reconnect with a luxurious couples spa package.",
      price: "$199.99",
      rating: 4.9,
      category: "experiences",
      affiliateLink: "https://example.com/affiliate/spa-experience",
      imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874"
    },
    {
      id: "3",
      name: "Heart Necklace Set",
      description: "Matching heart necklaces to symbolize your eternal love.",
      price: "$79.99",
      originalPrice: "$99.99",
      rating: 4.7,
      category: "jewelry",
      affiliateLink: "https://example.com/affiliate/heart-necklace",
      imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338"
    },
    {
      id: "4",
      name: "Smart Photo Frame",
      description: "Share photos instantly with your loved one using this connected photo frame.",
      price: "$149.99",
      rating: 4.6,
      category: "tech",
      affiliateLink: "https://example.com/affiliate/smart-frame",
      imageUrl: "https://images.unsplash.com/photo-1586953720263-776050cf2dfa"
    }
  ];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "gifts": return <Gift className="h-4 w-4" />;
      case "experiences": return <Heart className="h-4 w-4" />;
      case "jewelry": return <Star className="h-4 w-4" />;
      case "tech": return <ExternalLink className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const handleAffiliateClick = (affiliateLink: string, productName: string) => {
    // Track the click for analytics
    console.log(`Affiliate click: ${productName}`);
    
    // Open the affiliate link in a new tab
    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  };

  const displayProducts = products.slice(0, limit);

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Gift className="h-4 w-4 text-love-500" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex gap-3">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm truncate">{product.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{product.rating}</span>
                        </div>
                        <Badge variant="outline" className="text-xs px-1">
                          {getCategoryIcon(product.category)}
                          <span className="ml-1">{product.category}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-love-600">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs line-through text-muted-foreground">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs h-7"
                      onClick={() => handleAffiliateClick(product.affiliateLink, product.name)}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          * We may earn a commission from purchases made through these links
        </p>
      </CardContent>
    </Card>
  );
};

export default AffiliateProducts;
