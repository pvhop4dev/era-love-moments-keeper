import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoveCounter from "@/components/dashboard/LoveCounter";
import FengShuiInfo from "@/components/dashboard/FengShuiInfo";
import Calendar from "@/components/calendar/Calendar";
import DayDetailsSidebar from "@/components/calendar/DayDetailsSidebar";
import EventModal, { EventData } from "@/components/events/EventModal";
import PhotoModal, { PhotoData } from "@/components/photos/PhotoModal";
import PhotoAlbum from "@/components/albums/PhotoAlbum";
import SettingsModal from "@/components/settings/SettingsModal";
import MatchNotification from "@/components/match/MatchNotification";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, Image as ImageIcon, Calendar as CalendarIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getActiveMatch } from "@/utils/matchUtils";

const Dashboard = () => {
  const { t } = useLanguage();
  const [userData, setUserData] = useState({
    name: "",
    partnerName: "",
    email: "",
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
  const [hasActiveMatch, setHasActiveMatch] = useState(false);
  
  useEffect(() => {
    // Load user data
    const storedUser = localStorage.getItem("eralove-user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData({
        ...parsedUser,
        email: parsedUser.email || ""
      });
      
      // Check if user has an active match
      if (parsedUser.email) {
        const activeMatch = getActiveMatch(parsedUser.email);
        setHasActiveMatch(!!activeMatch);
      }
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
  };

  const handleAddEvent = () => {
    setSelectedEvent(undefined);
    setIsEventModalOpen(true);
  };

  const handleAddPhoto = () => {
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

  const handleSelectEvent = (event: EventData) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
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

  // Filter events and photos for the selected date
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split("T")[0];
    return events.filter(event => event.date === dateStr);
  };

  const getPhotosForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split("T")[0];
    return photos.filter(photo => photo.date === dateStr);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{t('welcome')}</h1>
          <div className="flex items-center gap-2 mt-2">
            <MatchNotification 
              userEmail={userData.email} 
              userName={userData.name}
              hasMatch={hasActiveMatch}
            />
          </div>
        </div>
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
        
        {/* Second Row - Calendar and Day Details */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="md:col-span-2">
              <Calendar 
                onDateClick={handleDateClick} 
                events={getDaysWithContent()}
                selectedDate={selectedDate}
              />
              
              {/* Recent Photos Album */}
              <div className="mt-6">
                <h2 className="font-semibold text-xl flex items-center gap-2 mb-4">
                  <ImageIcon className="h-5 w-5 text-love-500" />
                  {t('recentPhotos')}
                </h2>
                <PhotoAlbum 
                  photos={photos.slice(0, 4)}
                  onSelectPhoto={handleSelectPhoto}
                />
              </div>
            </div>
            
            {/* Day Details Sidebar */}
            <div className="md:col-span-1">
              {selectedDate ? (
                <DayDetailsSidebar
                  selectedDate={selectedDate}
                  eventsForDay={getEventsForSelectedDate()}
                  photosForDay={getPhotosForSelectedDate()}
                  onAddEvent={handleAddEvent}
                  onAddPhoto={handleAddPhoto}
                  onSelectEvent={handleSelectEvent}
                  onSelectPhoto={handleSelectPhoto}
                />
              ) : (
                <Card className="h-full flex items-center justify-center p-6">
                  <div className="text-center text-muted-foreground">
                    <CalendarIcon className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>{t('selectDayToSeeDetails')}</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
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
