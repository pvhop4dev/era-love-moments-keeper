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
import AuthenticatedImage from "@/components/common/AuthenticatedImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, MapPin, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import AnonymousChat from "@/components/chat/AnonymousChat";
import photoService from '@/services/photo.service';
import eventService from '@/services/event.service';
import userService from '@/services/user.service';
import { formatDateTimeForBackend, extractDateFromBackend } from '@/utils/datetimeUtils';
import { getAvatarUrl, getUserInitial } from '@/utils/avatarUtils';

const Dashboard = () => {
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
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
  
  // Refresh user profile on mount to ensure latest data
  useEffect(() => {
    const refreshUserProfile = async () => {
      try {
        console.log('[Dashboard] Refreshing user profile...');
        const updatedUser = await userService.getProfile();
        console.log('[Dashboard] Updated user profile:', updatedUser);
        console.log('[Dashboard] User avatar from API:', updatedUser.avatar);
        updateUser(updatedUser);
      } catch (error) {
        console.error('[Dashboard] Error refreshing user profile:', error);
      }
    };
    
    if (user) {
      refreshUserProfile();
    }
  }, []); // Run once on mount
  
  // Log user avatar whenever it changes
  useEffect(() => {
    if (user) {
      console.log('[Dashboard] Current user:', user);
      console.log('[Dashboard] Current user avatar:', user.avatar);
      console.log('[Dashboard] Avatar URL will be:', getAvatarUrl(user.avatar));
    }
  }, [user?.avatar]);
  
  useEffect(() => {
    // User data is loaded from AuthContext
    // Check if user needs to set avatar (first-time login)
    if (user && !user.avatar) {
      setIsFirstTimeSetupOpen(true);
    }
  }, [user]);
  
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
  
  // Load events from API
  const loadEvents = async () => {
    try {
      const token = localStorage.getItem('eralove-token');
      if (!token) {
        console.warn('[Dashboard] No token found for events');
        return;
      }

      console.log('[Dashboard] Loading events from API...');
      
      const response = await eventService.getEvents({ page: 1, limit: 100 });
      console.log('[Dashboard] Events from API:', response);
      
      // Convert to EventData format
      const eventsData: EventData[] = response.events?.map((event: any) => {
        // Backend returns RFC3339 datetime, extract date part only
        const dateStr = event.date || event.eventDate;
        const dateOnly = dateStr ? extractDateFromBackend(dateStr) : "";
        
        return {
          id: event.id,
          title: event.title,
          description: event.description || "",
          date: dateOnly,
          time: event.time || event.eventTime || "",
          location: event.location || "",
          images: []
        };
      }) || [];
      
      setEvents(eventsData);
      console.log('[Dashboard] Events loaded successfully:', eventsData.length);
    } catch (error) {
      console.error('[Dashboard] Error loading events:', error);
      setEvents([]);
    }
  };

  // Load events and photos in a separate effect
  useEffect(() => {
    loadEvents();
    
    // Load photos from API
    const loadPhotos = async () => {
      try {
        const token = localStorage.getItem('eralove-token');
        if (!token) {
          console.warn('[Dashboard] No token found for photos');
          return;
        }
        
        console.log('[Dashboard] Loading photos from API...');
        
        const response = await photoService.getPhotos(1, 100);
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
        
        const photosData: PhotoData[] = response.photos?.map((photo: any) => {
          const dateOnly = photo.date ? extractDateFromBackend(photo.date) : extractDateFromBackend(new Date().toISOString());
          
          return {
            id: photo.id,
            title: photo.title,
            description: photo.description || "",
            date: dateOnly,
            imageUrl: photo.imageUrl ? `${apiBaseUrl}/files/${photo.imageUrl}` : "",
            location: photo.location,
            coordinates: photo.coordinates
          };
        }) || [];
        
        setPhotos(photosData);
        console.log('[Dashboard] Photos loaded successfully:', photosData.length);
        console.log('[Dashboard] Photo dates:', photosData.map(p => p.date));
      } catch (error) {
        console.error('[Dashboard] Error loading photos:', error);
        setPhotos([]);
      }
    };
    
    loadPhotos();
      
    // Check match status directly from user data
    if (user) {
      console.log('[Dashboard] Checking match status from user data...');
      console.log('[Dashboard] User partnerId:', user.partnerId);
      console.log('[Dashboard] User partnerName:', user.partnerName);
      console.log('[Dashboard] User anniversaryDate:', user.anniversaryDate);
      
      // User is matched if they have a partnerId
      const isMatched = !!user.partnerId;
      setHasActiveMatch(isMatched);
      
      if (isMatched) {
        console.log('[Dashboard] User is matched');
        setPartnerDetails({
          name: user.partnerName || "Partner",
          email: "", // We don't have partner email in user object, but it's not critical
          anniversaryDate: user.anniversaryDate || "",
          dateOfBirth: ""
        });
      } else {
        console.log('[Dashboard] User is not matched');
        setPartnerDetails(null);
      }
    }
  }, [user]);

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

  const handleSaveEvent = async (eventData: EventData) => {
    try {
      if (selectedEvent) {
        // Update existing event
        console.log('[Dashboard] Updating event:', eventData);
        
        // Convert to RFC3339 format for backend
        const dateTime = formatDateTimeForBackend(eventData.date, eventData.time);
        
        await eventService.updateEvent(eventData.id, {
          title: eventData.title,
          description: eventData.description,
          date: dateTime,
          time: eventData.time,
          location: eventData.location,
        });
        
        // Reload events from API
        await loadEvents();
      } else {
        // Create new event
        console.log('[Dashboard] Creating event:', eventData);
        
        // Convert to RFC3339 format for backend
        const dateTime = formatDateTimeForBackend(eventData.date, eventData.time);
        
        const requestPayload = {
          title: eventData.title,
          description: eventData.description,
          date: dateTime,
          time: eventData.time,
          location: eventData.location,
          event_type: 'other',
        };
        
        console.log('[Dashboard] Request payload:', JSON.stringify(requestPayload, null, 2));
        
        await eventService.createEvent(requestPayload);
        
        // Reload events from API
        await loadEvents();
      }
    } catch (error) {
      console.error('[Dashboard] Error saving event:', error);
    }
  };

  const handleSavePhoto = async (photoData: PhotoData) => {
    // Photo saving is handled in PhotoModal via API
    // Just reload photos from API
    try {
      console.log('[Dashboard] Reloading photos after save...');
      
      const response = await photoService.getPhotos(1, 100);
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
      
      const photosData: PhotoData[] = response.photos?.map((photo: any) => {
        const dateOnly = photo.date ? extractDateFromBackend(photo.date) : extractDateFromBackend(new Date().toISOString());
        
        return {
          id: photo.id,
          title: photo.title,
          description: photo.description || "",
          date: dateOnly,
          imageUrl: photo.imageUrl ? `${apiBaseUrl}/files/${photo.imageUrl}` : "",
          location: photo.location,
          coordinates: photo.coordinates
        };
      }) || [];
      
      setPhotos(photosData);
      console.log('[Dashboard] Photos reloaded:', photosData.length);
      console.log('[Dashboard] Photo dates:', photosData.map(p => p.date));
    } catch (error) {
      console.error('[Dashboard] Error reloading photos:', error);
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
    
    const allDates = new Set<string>();
    
    events.forEach(event => {
      if (event.date) {
        allDates.add(event.date);
      }
    });
    
    photos.forEach(photo => {
      if (photo.date) {
        allDates.add(photo.date);
      }
    });
    
    console.log('[Dashboard] Days with content:', Array.from(allDates));
    console.log('[Dashboard] Events count:', events.length);
    console.log('[Dashboard] Photos count:', photos.length);
    
    return Array.from(allDates).map(date => ({
      date: date,
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
        <div className="flex-1">
          {hasActiveMatch ? (
            <div className="flex flex-col gap-3">
              <h1 className="text-2xl font-semibold">{t('welcome')}</h1>
              {/* Display both users with avatars */}
              <div className="flex items-center gap-4">
                {/* Current User */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    {getAvatarUrl(user?.avatar) ? (
                      <img 
                        src={getAvatarUrl(user?.avatar)} 
                        alt={user?.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-love-300"
                        onError={(e) => {
                          // Fallback to initial if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-12 h-12 rounded-full bg-love-100 flex items-center justify-center border-2 border-love-300 ${getAvatarUrl(user?.avatar) ? 'hidden' : ''}`}>
                      <span className="text-love-600 font-semibold text-lg">
                        {getUserInitial(user?.name)}
                      </span>
                    </div>
                  </div>
                  <span className="font-medium text-gray-700">{user?.name}</span>
                </div>
                
                {/* Heart Icon */}
                <div className="flex items-center">
                  <Heart className="w-6 h-6 text-love-500 fill-love-500 animate-pulse" />
                </div>
                
                {/* Partner */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    {/* Partner avatar - we don't have it in partnerDetails, so show initial */}
                    <div className="w-12 h-12 rounded-full bg-couple-100 flex items-center justify-center border-2 border-couple-300">
                      <span className="text-couple-600 font-semibold text-lg">
                        {partnerDetails?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <span className="font-medium text-gray-700">{partnerDetails?.name}</span>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <MatchNotification 
                  userEmail={userData.email} 
                  userName={userData.name}
                  hasMatch={hasActiveMatch}
                />
                {partnerDetails && (
                  <MessagesSection
                    userEmail={userData.email}
                    userName={userData.name}
                    partnerEmail={partnerDetails.email}
                    partnerName={partnerDetails.name}
                  />
                )}
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-semibold">
                Please send match request to start your love journey
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <MatchNotification 
                  userEmail={userData.email} 
                  userName={userData.name}
                  hasMatch={hasActiveMatch}
                />
              </div>
            </div>
          )}
        </div>
        <SettingsMenu 
          userEmail={userData.email}
          onUnpair={handleUnpair}
          onOpenThemeSettings={() => setIsThemeSettingsOpen(true)}
          onOpenPersonalInfo={() => setIsPersonalInfoOpen(true)}
        />
      </div>
      
     

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
                photos={photos}
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
