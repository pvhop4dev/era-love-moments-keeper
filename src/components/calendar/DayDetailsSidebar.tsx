
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar as CalendarIcon, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { EventData } from "@/components/events/EventModal";
import { PhotoData } from "@/components/photos/PhotoModal";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-love-500" />
          {formattedDate}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <Tabs
          defaultValue="events"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {t("events")} {eventsForDay.length > 0 && `(${eventsForDay.length})`}
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              {t("photos")} {photosForDay.length > 0 && `(${photosForDay.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="space-y-3">
            <Button
              onClick={onAddEvent}
              className="love-button w-full flex items-center gap-2 py-1.5"
              size="sm"
            >
              <PlusCircle className="h-4 w-4" />
              {t("addEvent")}
            </Button>
            
            {eventsForDay.length > 0 ? (
              <ScrollArea className="h-[250px] pr-2">
                <div className="space-y-2">
                  {eventsForDay.map((event) => (
                    <Card
                      key={event.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onSelectEvent(event)}
                    >
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm">{event.title}</h3>
                        <p className="text-xs mt-1">
                          {event.time} • {event.location}
                        </p>
                        <p className="text-xs mt-1 text-muted-foreground line-clamp-1">
                          {event.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-center text-muted-foreground py-4 text-sm">
                {t("noEventsForThisDay")}
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="photos" className="space-y-3">
            <Button
              onClick={onAddPhoto}
              className="love-button w-full flex items-center gap-2 py-1.5"
              size="sm"
            >
              <PlusCircle className="h-4 w-4" />
              {t("addPhoto")}
            </Button>
            
            {photosForDay.length > 0 ? (
              <ScrollArea className="h-[250px] pr-2">
                <div className="grid grid-cols-1 gap-3">
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
                      <div className="p-2">
                        <h3 className="font-medium text-sm line-clamp-1">{photo.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {photo.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-center text-muted-foreground py-4 text-sm">
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
