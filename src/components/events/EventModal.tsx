
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
import { Calendar, Clock, Trash } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  images: string[];  // Keeping for backward compatibility
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
    images: [],
  });

  useEffect(() => {
    if (selectedDate) {
      setEventData((prev) => ({
        ...prev,
        date: selectedDate.toISOString().split("T")[0],
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

  const handleSave = () => {
    if (!eventData.title) {
      toast.error("Please enter an event title");
      return;
    }

    const finalEventData = {
      ...eventData,
      images: [], // Keep empty array for backward compatibility
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
            <Input
              id="location"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              placeholder={t('locationPlaceholder')}
            />
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
