
import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoveCounter from "@/components/dashboard/LoveCounter";
import FengShuiInfo from "@/components/dashboard/FengShuiInfo";
import Calendar from "@/components/calendar/Calendar";
import EventModal, { EventData } from "@/components/events/EventModal";
import PhotoModal, { PhotoData } from "@/components/photos/PhotoModal";
import PhotoAlbum from "@/components/albums/PhotoAlbum";
import SettingsModal from "@/components/settings/SettingsModal";
import { Button } from "@/components/ui/button";
import { Settings, Image as ImageIcon, Calendar as CalendarIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { t } = useLanguage();
  const [userData, setUserData] = useState({
    name: "",
    partnerName: "",
    anniversaryDate: "",
  });
  
  const [events, setEvents] = useState<EventData[]>([]);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventData | undefined>(undefined);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | undefined>(undefined);
  
  useEffect(() => {
    // Load user data
    const storedUser = localStorage.getItem("eralove-user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
    }
    
    // Load events
    const storedEvents = localStorage.getItem("eralove-events");
    if (storedEvents) {
      try {
        setEvents(JSON.parse(storedEvents));
      } catch (error) {
        console.error("Error parsing events:", error);
      }
    } else {
      // Set sample events for demo purposes
      const sampleEvents: EventData[] = [
        {
          id: "event-1",
          title: "First Date",
          description: "Our first dinner date at the Italian restaurant",
          date: "2023-05-15",
          time: "19:00",
          location: "Luigi's Restaurant",
          images: []
        },
        {
          id: "event-2",
          title: "Beach Day",
          description: "Spent the day at the beach watching sunset",
          date: "2023-06-20",
          time: "15:00",
          location: "Sunset Beach",
          images: []
        }
      ];
      
      setEvents(sampleEvents);
      localStorage.setItem("eralove-events", JSON.stringify(sampleEvents));
    }
    
    // Load photos
    const storedPhotos = localStorage.getItem("eralove-photos");
    if (storedPhotos) {
      try {
        setPhotos(JSON.parse(storedPhotos));
      } catch (error) {
        console.error("Error parsing photos:", error);
      }
    } else {
      // Set sample photos for demo purposes
      const samplePhotos: PhotoData[] = [
        {
          id: "photo-1",
          title: "Dinner Selfie",
          description: "Our first dinner together",
          date: "2023-05-15", 
          imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
        },
        {
          id: "photo-2",
          title: "Beach Sunset",
          description: "Beautiful sunset at the beach",
          date: "2023-06-20",
          imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
        },
        {
          id: "photo-3",
          title: "Cafe Date",
          description: "Morning coffee together",
          date: "2023-06-20",
          imageUrl: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd"
        },
        {
          id: "photo-4",
          title: "Ocean View",
          description: "Looking at the waves",
          date: "2023-06-20",
          imageUrl: "https://images.unsplash.com/photo-1414609245224-afa02bfb3fda"
        }
      ];
      
      setPhotos(samplePhotos);
      localStorage.setItem("eralove-photos", JSON.stringify(samplePhotos));
    }
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    
    // Check if there's an event on this date
    const dateStr = date.toISOString().split("T")[0];
    const eventOnDate = events.find(event => event.date === dateStr);
    
    if (eventOnDate) {
      setSelectedEvent(eventOnDate);
    } else {
      setSelectedEvent(undefined);
    }
    
    setIsEventModalOpen(true);
  };

  const handleAddPhotoClick = () => {
    setSelectedPhoto(undefined);
    setIsPhotoModalOpen(true);
  };

  const handleSaveEvent = (eventData: EventData) => {
    // Check if updating or creating
    if (selectedEvent) {
      // Update existing event
      const updatedEvents = events.map(event => 
        event.id === eventData.id ? eventData : event
      );
      setEvents(updatedEvents);
      localStorage.setItem("eralove-events", JSON.stringify(updatedEvents));
    } else {
      // Add new event
      const newEvents = [...events, eventData];
      setEvents(newEvents);
      localStorage.setItem("eralove-events", JSON.stringify(newEvents));
    }
  };
  
  const handleSavePhoto = (photoData: PhotoData) => {
    // Check if updating or creating
    if (selectedPhoto) {
      // Update existing photo
      const updatedPhotos = photos.map(photo => 
        photo.id === photoData.id ? photoData : photo
      );
      setPhotos(updatedPhotos);
      localStorage.setItem("eralove-photos", JSON.stringify(updatedPhotos));
    } else {
      // Add new photo
      const newPhotos = [...photos, photoData];
      setPhotos(newPhotos);
      localStorage.setItem("eralove-photos", JSON.stringify(newPhotos));
    }
  };
  
  const handleSelectPhoto = (photo: PhotoData) => {
    setSelectedPhoto(photo);
    setIsPhotoModalOpen(true);
  };

  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  // Get all dates that have events or photos for calendar highlighting
  const getDaysWithContent = () => {
    const allDates = new Set();
    events.forEach(event => allDates.add(event.date));
    photos.forEach(photo => allDates.add(photo.date));
    
    return Array.from(allDates).map(date => ({
      date: date as string,
      title: ""
    }));
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t('welcome')}</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={openSettings}
        >
          <Settings className="h-4 w-4" />
          {t('settings')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First Row */}
        <div className="md:col-span-2">
          <LoveCounter anniversaryDate={userData.anniversaryDate} />
        </div>
        <div>
          <FengShuiInfo />
        </div>
        
        {/* Second Row */}
        <div className="md:col-span-2">
          <Calendar 
            onDateClick={handleDateClick} 
            events={getDaysWithContent()}
          />
          
          {/* Event List */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-love-500" />
                {t('yourSpecialMoments')}
              </h2>
            </div>
            
            {events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {events.map((event) => (
                  <div 
                    key={event.id}
                    className="p-4 rounded-lg cursor-pointer transition-all hover:shadow-md border border-gray-200 bg-white"
                    onClick={() => {
                      setSelectedEvent(event);
                      setSelectedDate(new Date(event.date));
                      setIsEventModalOpen(true);
                    }}
                  >
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-xs mt-1 truncate">{event.location}</p>
                    <p className="text-xs mt-1 line-clamp-2 text-muted-foreground">{event.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                {t('noEvents')}
              </p>
            )}
          </div>
        </div>
        
        {/* Photo Album Section */}
        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleAddPhotoClick}
            className="love-button w-full flex items-center gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            {t('addPhoto')}
          </Button>
          
          <PhotoAlbum 
            photos={photos}
            onSelectPhoto={handleSelectPhoto}
          />
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
        event={selectedEvent}
      />
      
      {/* Photo Modal */}
      <PhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSavePhoto}
        photo={selectedPhoto}
      />
      
      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
