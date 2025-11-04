import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoveCounter from "@/components/dashboard/LoveCounter";
import FengShuiInfo from "@/components/dashboard/FengShuiInfo";
import Calendar from "@/components/calendar/Calendar";
import DayDetailsSidebar from "@/components/calendar/DayDetailsSidebar";
import EventModal, { EventData } from "@/components/events/EventModal";
import PhotoModal, { PhotoData } from "@/components/photos/PhotoModal";
import LoveIdeas from "@/components/suggestions/LoveIdeas";
import SettingsMenu from "@/components/settings/SettingsMenu";
import ThemeSettingsModal from "@/components/settings/ThemeSettingsModal";
import PersonalInfoModal from "@/components/settings/PersonalInfoModal";
import FirstTimeSetupModal from "@/components/settings/FirstTimeSetupModal";
import MatchNotification from "@/components/match/MatchNotification";
import MessagesSection from "@/components/messages/MessagesSection";
import LoveMap from "@/components/map/LoveMap";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { getActiveMatch, getPartnerDetails } from "@/utils/matchUtils";
import AnonymousChat from "@/components/chat/AnonymousChat";
import photoService from "@/services/photo.service";

const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    name: "",
    partnerName: "",
    email: "",
    anniversaryDate: "",
    dateOfBirth: "",
  });
  
  const [events, setEvents] = useState<EventData[]>([]);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isThemeSettingsOpen, setIsThemeSettingsOpen] = useState(false);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isFirstTimeSetupOpen, setIsFirstTimeSetupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventData | undefined>(undefined);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | undefined>(undefined);
  const [hasActiveMatch, setHasActiveMatch] = useState(false);
  const [partnerDetails, setPartnerDetails] = useState<{
    name: string;
    email: string;
    anniversaryDate: string;
    dateOfBirth: string;
  } | null>(null);
  const [showAnonymousChat, setShowAnonymousChat] = useState(false);
  
  useEffect(() => {
    // Load user data
    const storedUser = localStorage.getItem("eralove-user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData({
        name: parsedUser.name || "",
        partnerName: parsedUser.partnerName || "",
        email: parsedUser.email || "",
        anniversaryDate: parsedUser.anniversaryDate || "",
        dateOfBirth: parsedUser.dateOfBirth || ""
      });
      
      // Check if user needs to set avatar (first-time login)
      if (!parsedUser.avatar) {
        setIsFirstTimeSetupOpen(true);
      }
    }
  }, []);
  
  // Separate effect to watch for avatar changes from AuthContext
  useEffect(() => {
    if (user && user.avatar && isFirstTimeSetupOpen) {
      // Close the modal if avatar was just set
      setIsFirstTimeSetupOpen(false);
    }
    
    // Update userData when user changes in AuthContext
    if (user) {
      setUserData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        dateOfBirth: user.dateOfBirth || prev.dateOfBirth,
      }));
    }
  }, [user, isFirstTimeSetupOpen]);
  
  // Load events and photos in a separate effect
  useEffect(() => {
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
    
    // Load photos from API
    const loadPhotos = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem('eralove-token');
        console.log('Token exists:', !!token);
        console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null');
        
        if (!token) {
          console.warn('No authentication token found. User needs to login via API to access photos.');
          console.info('Photos will be empty until user logs in with backend authentication.');
          return;
        }
        
        console.log('Calling photoService.getPhotos with token...');
        
        const response = await photoService.getPhotos(1, 100);
        console.log('Photos from API:', response);
        
        // Get API base URL (already includes /api/v1)
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
        
        // Convert API response to PhotoData format
        const photosData: PhotoData[] = response.photos?.map((photo: any) => {
          // Backend returns path like "photos/userid_timestamp.jpg"
          // API client converts image_url → imageUrl automatically
          // We need to build: http://localhost:8080/api/v1/files/photos/userid_timestamp.jpg
          
          console.log('Raw photo from API:', photo);
          console.log('photo.imageUrl (camelCase):', photo.imageUrl);
          console.log('apiBaseUrl:', apiBaseUrl);
          
          // Use photo.imageUrl (camelCase) because api-client converts it
          const imageUrl = photo.imageUrl ? `${apiBaseUrl}/files/${photo.imageUrl}` : "";
          
          console.log('Built full imageUrl:', imageUrl);
          
          return {
            id: photo.id,
            title: photo.title,
            description: photo.description || "",
            date: photo.date ? new Date(photo.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            imageUrl: imageUrl,
            location: photo.location,
            coordinates: photo.coordinates
          };
        }) || [];
        
        console.log('Processed photos:', photosData);
        
        // Debug: Test first image URL
        if (photosData.length > 0) {
          console.log('Testing first image URL:', photosData[0].imageUrl);
          fetch(photosData[0].imageUrl)
            .then(res => {
              console.log('Image fetch response:', res.status, res.statusText);
              if (!res.ok) {
                console.error('Failed to fetch image:', res.status);
              }
            })
            .catch(err => console.error('Image fetch error:', err));
        }
        
        setPhotos(photosData);
      } catch (error) {
        console.error("Error loading photos from API:", error);
        // Fallback to localStorage if API fails
        const storedPhotos = localStorage.getItem("eralove-photos");
        if (storedPhotos) {
          try {
            setPhotos(JSON.parse(storedPhotos));
          } catch (error) {
            console.error("Error parsing photos:", error);
          }
        }
      }
    };
    
    loadPhotos();
      
    // Check if user has an active match
    const storedUser = localStorage.getItem("eralove-user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.email) {
        const activeMatch = getActiveMatch(parsedUser.email);
        setHasActiveMatch(!!activeMatch);
        
        // If there's an active match, get partner details
        if (activeMatch) {
          const partner = getPartnerDetails(parsedUser.email);
          if (partner) {
            setPartnerDetails({
              name: partner.name,
              email: partner.email,
              anniversaryDate: partner.anniversaryDate,
              dateOfBirth: "" // Default empty string for partner's dateOfBirth
            });
          }
        }
      }
    }
  }, []);

  const handleDateClick = (date: Date) => {
    // Only allow date selection if user has active match
    if (hasActiveMatch) {
      setSelectedDate(date);
    }
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

  // Get all dates that have events or photos for calendar highlighting
  const getDaysWithContent = () => {
    // Only show event/photo markers if user has active match
    if (!hasActiveMatch) {
      return [];
    }
    
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
    const filtered = photos.filter(photo => photo.date === dateStr);
    console.log('Selected date:', dateStr, 'Filtered photos:', filtered.length, 'Total photos:', photos.length);
    return filtered;
  };

  const handleUnpair = () => {
    // Update local state
    setHasActiveMatch(false);
    setPartnerDetails(null);
    
    // Update userData
    setUserData(prev => ({
      name: prev.name,
      email: prev.email,
      dateOfBirth: prev.dateOfBirth,
      partnerName: "",
      anniversaryDate: ""
    }));
    
    // Close the sidebar if it's open
    setSelectedDate(null);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            {hasActiveMatch 
              ? t('welcome') 
              : "Please send match request to start your love journey"}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <MatchNotification 
              userEmail={userData.email} 
              userName={userData.name}
              hasMatch={hasActiveMatch}
            />
            {/* Add Messages button here when user has active match */}
            {hasActiveMatch && partnerDetails && (
              <MessagesSection
                userEmail={userData.email}
                userName={userData.name}
                partnerEmail={partnerDetails.email}
                partnerName={partnerDetails.name}
              />
            )}
          </div>
        </div>
        <SettingsMenu 
          userEmail={userData.email}
          onUnpair={handleUnpair}
          onOpenThemeSettings={() => setIsThemeSettingsOpen(true)}
          onOpenPersonalInfo={() => setIsPersonalInfoOpen(true)}
        />
      </div>
      
      {/* Debug: Show all photos */}
      {photos.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>All Photos ({photos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      console.error('Image failed to load:', photo.imageUrl);
                      console.error('Expected format: http://localhost:8080/api/v1/files/photos/...');
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <p className="text-xs mt-1 truncate">{photo.title}</p>
                  <p className="text-xs text-gray-500">{photo.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First Row */}
        <div className="md:col-span-2">
          <LoveCounter 
            anniversaryDate={hasActiveMatch ? partnerDetails?.anniversaryDate || userData.anniversaryDate : null} 
            partnerName={hasActiveMatch ? partnerDetails?.name || userData.partnerName : null}
          />
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
              
              {/* Love Ideas Section */}
              <div className="mt-6">
                <LoveIdeas hasActiveMatch={hasActiveMatch} />
              </div>
            </div>
            
            {/* Day Details Sidebar */}
            <div className="md:col-span-1">
              {hasActiveMatch && selectedDate ? (
                <DayDetailsSidebar
                  selectedDate={selectedDate}
                  eventsForDay={getEventsForSelectedDate()}
                  photosForDay={getPhotosForSelectedDate()}
                  onAddEvent={handleAddEvent}
                  onAddPhoto={handleAddPhoto}
                  onSelectEvent={handleSelectEvent}
                  onSelectPhoto={handleSelectPhoto}
                  userDateOfBirth={userData.dateOfBirth}
                  partnerDateOfBirth={partnerDetails?.dateOfBirth}
                  anniversaryDate={hasActiveMatch ? partnerDetails?.anniversaryDate || userData.anniversaryDate : undefined}
                />
              ) : (
                <Card className="h-full flex items-center justify-center p-6">
                  <div className="text-center text-muted-foreground">
                    <CalendarIcon className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    {hasActiveMatch ? (
                      <p>{t('selectDayToSeeDetails')}</p>
                    ) : (
                      <p>Connect with your partner to add events and photos</p>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Third Row - Love Map */}
        <div className="md:col-span-3">
          <div className="mt-6">
            <h2 className="font-semibold text-xl flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-love-500" />
              Love Map
            </h2>
            {hasActiveMatch ? (
              <LoveMap
                events={events}
                photos={photos}
                onEventClick={handleSelectEvent}
                onPhotoClick={handleSelectPhoto}
              />
            ) : (
              <Card className="p-6 text-center text-muted-foreground">
                <p>Connect with your partner to see your love map with shared locations</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Show modals only if the user has an active match */}
      {hasActiveMatch && (
        <>
          <EventModal
            isOpen={isEventModalOpen}
            onClose={() => setIsEventModalOpen(false)}
            selectedDate={selectedDate}
            onSave={handleSaveEvent}
            event={selectedEvent}
          />
          
          <PhotoModal
            isOpen={isPhotoModalOpen}
            onClose={() => setIsPhotoModalOpen(false)}
            selectedDate={selectedDate}
            onSave={handleSavePhoto}
            photo={selectedPhoto}
          />
        </>
      )}
      
      {/* Theme Settings Modal */}
      <ThemeSettingsModal
        isOpen={isThemeSettingsOpen}
        onClose={() => setIsThemeSettingsOpen(false)}
      />
      
      {/* Personal Information Modal */}
      <PersonalInfoModal
        isOpen={isPersonalInfoOpen}
        onClose={() => setIsPersonalInfoOpen(false)}
        userEmail={userData.email}
      />
      
      {/* First Time Setup Modal */}
      <FirstTimeSetupModal
        isOpen={isFirstTimeSetupOpen}
        onClose={() => setIsFirstTimeSetupOpen(false)}
      />
      
      {/* Anonymous Chat */}
      <AnonymousChat
        userEmail={userData.email}
        isOpen={showAnonymousChat}
        onClose={() => setShowAnonymousChat(false)}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
