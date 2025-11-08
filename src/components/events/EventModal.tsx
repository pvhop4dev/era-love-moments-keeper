import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar, Clock, Trash, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { extractDateFromBackend, formatDateObjectForBackend } from "@/utils/datetimeUtils";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onSave: (eventData: EventData) => void;
  event?: EventData;
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  images: string[];
}

const EventModal = ({ isOpen, onClose, selectedDate, onSave, event }: EventModalProps) => {
  const { t } = useLanguage();
  const [eventData, setEventData] = useState<EventData>({
    id: "",
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    coordinates: undefined,
    images: [],
  });
  const [isGeocodingLocation, setIsGeocodingLocation] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      setEventData((prev) => ({
        ...prev,
        date: extractDateFromBackend(formatDateObjectForBackend(selectedDate)),
      }));
    }
    
    if (event) {
      setEventData(event);
    } else {
      // Generate a unique ID for new events
      setEventData((prev) => ({
        ...prev,
        id: `event-${Date.now()}`,
      }));
    }
  }, [selectedDate, event, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  const geocodeLocation = async (location: string) => {
    if (!location.trim()) return;
    
    setIsGeocodingLocation(true);
    try {
      // Use a free geocoding service or ask user to input their own API key
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const coordinates = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        setEventData(prev => ({ ...prev, coordinates }));
        toast.success("Location coordinates found!");
      } else {
        toast.error("Location not found. Please try a more specific address.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast.error("Failed to find location coordinates.");
    } finally {
      setIsGeocodingLocation(false);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const location = e.target.value;
    setEventData(prev => ({ ...prev, location }));
    
    // Auto-geocode when user stops typing
    if (location.trim()) {
      const timeoutId = setTimeout(() => {
        geocodeLocation(location);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  };

  const handleSave = () => {
    if (!eventData.title) {
      toast.error("Please enter an event title");
      return;
    }

    const finalEventData = {
      ...eventData,
      images: [],
    };

    onSave(finalEventData);
    toast.success(`Event ${event ? "updated" : "created"} successfully!`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-love-700 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-love-500" />
            {event ? t('editEvent') : t('createEvent')}
          </DialogTitle>
          <DialogDescription>
            {selectedDate
              ? `${t('addMoment')} ${selectedDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}`
              : t('createNewEvent')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{t('title')}</Label>
            <Input
              id="title"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              placeholder={t('eventPlaceholder')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              placeholder={t('descriptionPlaceholder')}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">{t('date')}</Label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={eventData.date}
                  onChange={handleChange}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">{t('time')}</Label>
              <div className="relative">
                <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={eventData.time}
                  onChange={handleChange}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">{t('location')}</Label>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                name="location"
                value={eventData.location}
                onChange={handleLocationChange}
                placeholder={t('locationPlaceholder')}
                className="pl-8"
              />
              {isGeocodingLocation && (
                <div className="absolute right-2 top-2.5">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-love-500 border-t-transparent"></div>
                </div>
              )}
            </div>
            {eventData.coordinates && (
              <p className="text-xs text-muted-foreground">
                Coordinates: {eventData.coordinates.lat.toFixed(4)}, {eventData.coordinates.lng.toFixed(4)}
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-love-200 hover:bg-love-50"
          >
            {t('cancel')}
          </Button>
          {event && (
            <Button 
              variant="destructive" 
              className="flex items-center gap-1"
              onClick={() => {
                // This would handle delete in a real app
                toast.success(t('eventDeleted'));
                onClose();
              }}
            >
              <Trash className="h-4 w-4" />
              {t('delete')}
            </Button>
          )}
          <Button onClick={handleSave} className="love-button">
            {event ? t('update') : t('create')} {t('event')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
