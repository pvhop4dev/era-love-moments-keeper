
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LoveCounterProps {
  anniversaryDate: string;
}

const LoveCounter = ({ anniversaryDate }: LoveCounterProps) => {
  const [daysInLove, setDaysInLove] = useState(0);

  useEffect(() => {
    // Calculate days in love
    const startDate = new Date(anniversaryDate);
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - startDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    setDaysInLove(differenceInDays);
  }, [anniversaryDate]);

  return (
    <Card className="love-card overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-love-300 to-couple-light pb-2">
        <CardTitle className="text-center text-love-900">Days in Love</CardTitle>
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
