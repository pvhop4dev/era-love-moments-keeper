import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { extractDateFromBackend, formatDateObjectForBackend } from "@/utils/datetimeUtils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Heart, Circle } from "lucide-react";
import { EventData } from "@/components/events/EventModal";
import { PhotoData } from "@/components/photos/PhotoModal";

interface CalendarProps {
  onDateClick: (date: Date) => void;
  events: { date: string; title: string }[];
  selectedDate: Date | null;
  photos?: { date: string }[];
}

const Calendar = ({ onDateClick, events, selectedDate, photos = [] }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();

    // Calculate the number of days to show from the previous month
    const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    // Generate the days for the calendar
    const days: Date[] = [];

    // Add days from the previous month
    for (let i = daysFromPrevMonth; i > 0; i--) {
      days.push(new Date(year, month, -i + 1));
    }

    // Add days from the current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Add days from the next month
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    setCalendarDays(days);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const hasEvent = (date: Date) => {
    const dateStr = extractDateFromBackend(formatDateObjectForBackend(date));
    return events.some(event => event.date === dateStr);
  };

  const hasPhoto = (date: Date) => {
    const dateStr = extractDateFromBackend(formatDateObjectForBackend(date));
    return photos.some(photo => photo.date === dateStr);
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isSelectedDate = (date: Date) => {
    if (!selectedDate) return false;
    
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <Card className="love-card h-auto">
      <CardHeader className="pb-1 pt-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-center flex items-center gap-2 text-base">
            <CalendarIcon className="h-4 w-4 text-love-500" />
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-7 w-7">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-1 pb-3">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <div key={`day-${index}`} className="text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => onDateClick(day)}
              className={`calendar-day ${isCurrentMonth(day) ? '' : 'text-muted-foreground opacity-40'} ${
                isToday(day) ? 'calendar-day-current' : ''
              } ${isSelectedDate(day) ? 'calendar-day-selected' : ''} relative text-xs flex items-center justify-center h-6 w-6 rounded-full`}
            >
              {day.getDate()}
              {/* Event indicator - small dot */}
              {hasEvent(day) && (
                <Circle 
                  className="absolute -top-0.5 -left-0.5 h-1.5 w-1.5 text-blue-500 fill-blue-500" 
                />
              )}
              {/* Photo/Memory indicator - heart */}
              {hasPhoto(day) && (
                <Heart 
                  className="absolute -top-1 -right-1 h-2 w-2 text-love-500 heart-icon" 
                  fill="#FB7185" 
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;
