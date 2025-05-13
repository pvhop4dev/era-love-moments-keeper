
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FengShuiData {
  element: string;
  color: string;
  direction: string;
  luckyNumber: number;
  advice: string;
}

const elements = ["Wood", "Fire", "Earth", "Metal", "Water"];
const colors = ["Green", "Red", "Yellow", "White", "Blue"];
const directions = ["East", "South", "Center", "West", "North"];
const advices = [
  "Take time today to nurture your relationship with small gestures of love.",
  "Express your feelings openly and passionately to strengthen your bond.",
  "Find balance in your relationship by listening and compromising.",
  "Reflect on your shared values and future plans together.",
  "Go with the flow and be adaptable to changes in your relationship."
];

const FengShuiInfo = () => {
  const [fengShuiData, setFengShuiData] = useState<FengShuiData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an actual Feng Shui API
    // Here we're generating pseudo-random data based on the date
    const generateDailyFengShui = () => {
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
      
      const elementIndex = dayOfYear % elements.length;
      const colorIndex = dayOfYear % colors.length;
      const directionIndex = dayOfYear % directions.length;
      const adviceIndex = dayOfYear % advices.length;
      const luckyNumber = ((dayOfYear * 7) % 9) + 1;
      
      return {
        element: elements[elementIndex],
        color: colors[colorIndex],
        direction: directions[directionIndex],
        luckyNumber: luckyNumber,
        advice: advices[adviceIndex]
      };
    };

    setTimeout(() => {
      setFengShuiData(generateDailyFengShui());
      setLoading(false);
    }, 500);
  }, []);

  const getElementColor = (element: string) => {
    switch (element) {
      case "Wood": return "text-green-600";
      case "Fire": return "text-red-600";
      case "Earth": return "text-yellow-600";
      case "Metal": return "text-gray-500";
      case "Water": return "text-blue-600";
      default: return "text-purple-600";
    }
  };

  if (loading) {
    return (
      <Card className="love-card h-full">
        <CardHeader>
          <CardTitle className="text-center">Today's Feng Shui</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-32">
          <div className="animate-pulse text-center">
            Loading your daily harmony guidance...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="love-card h-full">
      <CardHeader>
        <CardTitle className="text-center">Today's Feng Shui</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Element</p>
            <p className={`text-lg font-medium ${getElementColor(fengShuiData?.element || "")}`}>
              {fengShuiData?.element}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Lucky Color</p>
            <p className="text-lg font-medium">{fengShuiData?.color}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Favorable Direction</p>
            <p className="text-lg font-medium">{fengShuiData?.direction}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Lucky Number</p>
            <p className="text-lg font-medium">{fengShuiData?.luckyNumber}</p>
          </div>
        </div>
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">Relationship Advice</p>
          <p className="text-sm italic">{fengShuiData?.advice}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FengShuiInfo;
