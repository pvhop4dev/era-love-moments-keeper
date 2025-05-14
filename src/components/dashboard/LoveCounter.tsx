
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface LoveCounterProps {
  anniversaryDate: string | null;
  partnerName: string | null;
}

const LoveCounter = ({ anniversaryDate, partnerName }: LoveCounterProps) => {
  const [daysInLove, setDaysInLove] = useState(0);

  useEffect(() => {
    // Calculate days in love only if there's an anniversary date
    if (anniversaryDate) {
      const startDate = new Date(anniversaryDate);
      const currentDate = new Date();
      const differenceInTime = currentDate.getTime() - startDate.getTime();
      const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
      setDaysInLove(differenceInDays > 0 ? differenceInDays : 0);
    } else {
      setDaysInLove(0);
    }
  }, [anniversaryDate]);

  if (!anniversaryDate || !partnerName) {
    return (
      <Card className="love-card overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 pb-2">
          <CardTitle className="text-center text-gray-500">Not Connected</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-center text-gray-500">
            Connect with your partner to start tracking your love journey together
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="love-card overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-love-300 to-couple-light pb-2">
        <CardTitle className="text-center text-love-900">Days in Love with {partnerName}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-6">
        <div className="text-6xl font-bold text-love-600 animate-heartbeat">
          {daysInLove}
        </div>
        <p className="mt-2 text-muted-foreground">
          {daysInLove > 0 ? (
            <>since {new Date(anniversaryDate).toLocaleDateString("en-US", { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</>
          ) : (
            "Your love journey begins today!"
          )}
        </p>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {daysInLove > 365 ? (
              <>That's {Math.floor(daysInLove / 365)} year(s) and {daysInLove % 365} day(s)!</>
            ) : daysInLove > 30 ? (
              <>That's {Math.floor(daysInLove / 30)} month(s) and {daysInLove % 30} day(s)!</>
            ) : daysInLove > 0 ? (
              <>Every day is a new memory to cherish</>
            ) : (
              <>Today marks the beginning of your story</>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoveCounter;
