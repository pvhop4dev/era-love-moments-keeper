
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Calendar, Heart } from "lucide-react";

interface CalendarSuggestionsProps {
  selectedDate: Date;
  userDateOfBirth?: string;
  partnerDateOfBirth?: string;
  anniversaryDate?: string;
}

const CalendarSuggestions = ({ 
  selectedDate, 
  userDateOfBirth, 
  partnerDateOfBirth, 
  anniversaryDate 
}: CalendarSuggestionsProps) => {
  const selectedDateStr = selectedDate.toISOString().split("T")[0];
  const selectedMonth = selectedDate.getMonth() + 1;
  const selectedDay = selectedDate.getDate();

  const suggestions = [];

  // Check for user birthday
  if (userDateOfBirth) {
    const birthDate = new Date(userDateOfBirth);
    if (birthDate.getMonth() + 1 === selectedMonth && birthDate.getDate() === selectedDay) {
      suggestions.push({
        type: "birthday",
        title: "Your Birthday!",
        description: "It's your special day - time to celebrate!",
        icon: <Gift className="h-4 w-4" />
      });
    }
  }

  // Check for partner birthday (if available)
  if (partnerDateOfBirth) {
    const partnerBirthDate = new Date(partnerDateOfBirth);
    if (partnerBirthDate.getMonth() + 1 === selectedMonth && partnerBirthDate.getDate() === selectedDay) {
      suggestions.push({
        type: "birthday",
        title: "Partner's Birthday!",
        description: "Don't forget to surprise your loved one!",
        icon: <Gift className="h-4 w-4" />
      });
    }
  }

  // Check for anniversary
  if (anniversaryDate) {
    const annivDate = new Date(anniversaryDate);
    if (annivDate.getMonth() + 1 === selectedMonth && annivDate.getDate() === selectedDay) {
      suggestions.push({
        type: "anniversary",
        title: "Your Anniversary!",
        description: "Celebrate your love and create new memories together!",
        icon: <Heart className="h-4 w-4" />
      });
    }
  }

  // Add common holidays
  const holidays = getHolidaysForDate(selectedMonth, selectedDay);
  suggestions.push(...holidays);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4 text-love-500" />
          Special Occasions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-center gap-2 p-2 bg-love-50 rounded-lg">
            <div className="text-love-500">{suggestion.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{suggestion.title}</span>
                <Badge variant="secondary" className="text-xs">
                  {suggestion.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{suggestion.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const getHolidaysForDate = (month: number, day: number) => {
  const holidays = [
    { month: 1, day: 1, title: "New Year's Day", description: "Start the year with love and resolutions together!" },
    { month: 2, day: 14, title: "Valentine's Day", description: "The perfect day to express your love!" },
    { month: 3, day: 8, title: "International Women's Day", description: "Celebrate the amazing women in your life!" },
    { month: 5, day: 12, title: "Mother's Day", description: "Honor the mothers who mean so much to you!" },
    { month: 6, day: 16, title: "Father's Day", description: "Celebrate the father figures in your life!" },
    { month: 10, day: 31, title: "Halloween", description: "Get spooky together with fun costumes!" },
    { month: 12, day: 25, title: "Christmas Day", description: "Spread joy and love during the holiday season!" },
  ];

  return holidays
    .filter(holiday => holiday.month === month && holiday.day === day)
    .map(holiday => ({
      type: "holiday",
      title: holiday.title,
      description: holiday.description,
      icon: <Calendar className="h-4 w-4" />
    }));
};

export default CalendarSuggestions;
