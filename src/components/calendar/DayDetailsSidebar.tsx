
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar as CalendarIcon, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { EventData } from "@/components/events/EventModal";
import { PhotoData } from "@/components/photos/PhotoModal";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DayDetailsSidebarProps {
  selectedDate: Date | null;
  eventsForDay: EventData[];
  photosForDay: PhotoData[];
  onAddEvent: () => void;
  onAddPhoto: () => void;
  onSelectEvent: (event: EventData) => void;
  onSelectPhoto: (photo: PhotoData) => void;
}

const DayDetailsSidebar = ({
  selectedDate,
  eventsForDay,
  photosForDay,
  onAddEvent,
  onAddPhoto,
  onSelectEvent,
  onSelectPhoto,
}: DayDetailsSidebarProps) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("events");

  if (!selectedDate) return null;

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-love-500" />
          {formattedDate}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <Tabs
          defaultValue="events"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {t("events")} {eventsForDay.length > 0 && `(${eventsForDay.length})`}
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              {t("photos")} {photosForDay.length > 0 && `(${photosForDay.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="space-y-4">
            <Button
              onClick={onAddEvent}
              className="love-button w-full flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              {t("addEvent")}
            </Button>
            
            {eventsForDay.length > 0 ? (
              <div className="space-y-3">
                {eventsForDay.map((event) => (
                  <Card
                    key={event.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onSelectEvent(event)}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-xs mt-1">
                        {event.time} • {event.location}
                      </p>
                      <p className="text-xs mt-2 text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                {t("noEventsForThisDay")}
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="photos" className="space-y-4">
            <Button
              onClick={onAddPhoto}
              className="love-button w-full flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              {t("addPhoto")}
            </Button>
            
            {photosForDay.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {photosForDay.map((photo) => (
                  <div
                    key={photo.id}
                    className="cursor-pointer hover:shadow-md transition-shadow bg-white rounded-lg overflow-hidden border"
                    onClick={() => onSelectPhoto(photo)}
                  >
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                        }}
                      />
                    </AspectRatio>
                    <div className="p-3">
                      <h3 className="font-medium line-clamp-1">{photo.title}</h3>
                      <p className="text-xs mt-1 text-muted-foreground line-clamp-2">
                        {photo.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                {t("noPhotosForThisDay")}
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DayDetailsSidebar;
