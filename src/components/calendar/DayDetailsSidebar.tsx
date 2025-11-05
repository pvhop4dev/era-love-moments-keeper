
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Image as ImageIcon, MapPin, Clock } from "lucide-react";
import { EventData } from "@/components/events/EventModal";
import { PhotoData } from "@/components/photos/PhotoModal";
import CalendarSuggestions from "./CalendarSuggestions";
import AffiliateProducts from "@/components/affiliate/AffiliateProducts";
import AuthenticatedImage from "@/components/common/AuthenticatedImage";

interface DayDetailsSidebarProps {
  selectedDate: Date;
  eventsForDay: EventData[];
  photosForDay: PhotoData[];
  onAddEvent: () => void;
  onAddPhoto: () => void;
  onSelectEvent: (event: EventData) => void;
  onSelectPhoto: (photo: PhotoData) => void;
  userDateOfBirth?: string;
  partnerDateOfBirth?: string;
  anniversaryDate?: string;
}

const DayDetailsSidebar = ({
  selectedDate,
  eventsForDay,
  photosForDay,
  onAddEvent,
  onAddPhoto,
  onSelectEvent,
  onSelectPhoto,
  userDateOfBirth,
  partnerDateOfBirth,
  anniversaryDate
}: DayDetailsSidebarProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-love-500" />
            {formatDate(selectedDate)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button 
              onClick={onAddEvent} 
              className="flex-1 love-button text-sm h-8"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Event
            </Button>
            <Button 
              onClick={onAddPhoto} 
              variant="outline" 
              className="flex-1 text-sm h-8"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events for this day */}
      {eventsForDay.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {eventsForDay.map((event) => (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="p-2 border rounded-lg cursor-pointer hover:bg-love-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    {event.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      {event.time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Photos for this day */}
      {photosForDay.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {photosForDay.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => onSelectPhoto(photo)}
                  className="relative cursor-pointer group"
                >
                  <AuthenticatedImage
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-20 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar Suggestions */}
      <CalendarSuggestions
        selectedDate={selectedDate}
        userDateOfBirth={userDateOfBirth}
        partnerDateOfBirth={partnerDateOfBirth}
        anniversaryDate={anniversaryDate}
      />

      {/* Affiliate Products */}
      <AffiliateProducts category="general" limit={2} />
    </div>
  );
};

export default DayDetailsSidebar;
