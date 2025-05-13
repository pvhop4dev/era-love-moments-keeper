
import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoveCounter from "@/components/dashboard/LoveCounter";
import FengShuiInfo from "@/components/dashboard/FengShuiInfo";
import Calendar from "@/components/calendar/Calendar";
import EventModal, { EventData } from "@/components/events/EventModal";
import PhotoAlbum from "@/components/albums/PhotoAlbum";

const Dashboard = () => {
  const [userData, setUserData] = useState({
    name: "",
    partnerName: "",
    anniversaryDate: "",
  });
  
  const [events, setEvents] = useState<EventData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventData | undefined>(undefined);
  const [selectedEventForAlbum, setSelectedEventForAlbum] = useState<EventData | null>(null);
  
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
          images: [
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
            "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd"
          ]
        },
        {
          id: "event-2",
          title: "Beach Day",
          description: "Spent the day at the beach watching sunset",
          date: "2023-06-20",
          time: "15:00",
          location: "Sunset Beach",
          images: [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            "https://images.unsplash.com/photo-1414609245224-afa02bfb3fda"
          ]
        }
      ];
      
      setEvents(sampleEvents);
      localStorage.setItem("eralove-events", JSON.stringify(sampleEvents));
    }
  }, []);
  
  // Set the first event as the selected event for the album initially
  useEffect(() => {
    if (events.length > 0 && !selectedEventForAlbum) {
      setSelectedEventForAlbum(events[0]);
    }
  }, [events, selectedEventForAlbum]);

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
    
    setIsModalOpen(true);
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
      
      // Update album selection if needed
      if (selectedEventForAlbum && selectedEventForAlbum.id === eventData.id) {
        setSelectedEventForAlbum(eventData);
      }
    } else {
      // Add new event
      const newEvents = [...events, eventData];
      setEvents(newEvents);
      localStorage.setItem("eralove-events", JSON.stringify(newEvents));
      
      // Set as selected album if it's the first event
      if (!selectedEventForAlbum) {
        setSelectedEventForAlbum(eventData);
      }
    }
  };

  const handleSelectEventForAlbum = (event: EventData) => {
    setSelectedEventForAlbum(event);
  };

  return (
    <DashboardLayout>
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
            events={events.map(e => ({ date: e.date, title: e.title }))}
          />
          
          {/* Event List */}
          <div className="mt-6">
            <h2 className="font-semibold text-xl mb-4">Your Special Moments</h2>
            
            {events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {events.map((event) => (
                  <div 
                    key={event.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedEventForAlbum?.id === event.id 
                        ? 'border-2 border-love-500 bg-love-50' 
                        : 'border border-gray-200 bg-white'
                    }`}
                    onClick={() => handleSelectEventForAlbum(event)}
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
                    <div className="mt-2 flex gap-1">
                      {event.images.slice(0, 3).map((img, i) => (
                        <div 
                          key={i} 
                          className="h-6 w-6 rounded-full overflow-hidden border border-gray-200"
                        >
                          <img 
                            src={img} 
                            alt="" 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/40?text=Img";
                            }}
                          />
                        </div>
                      ))}
                      {event.images.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-gray-200 text-xs flex items-center justify-center">
                          +{event.images.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No events yet. Click on a date in the calendar to create your first memory.
              </p>
            )}
          </div>
        </div>
        
        {/* Album Section */}
        <div>
          {selectedEventForAlbum ? (
            <PhotoAlbum
              eventTitle={selectedEventForAlbum.title}
              eventDate={selectedEventForAlbum.date}
              images={selectedEventForAlbum.images}
            />
          ) : (
            <div className="love-card h-full flex items-center justify-center">
              <p className="text-muted-foreground">
                Create an event to start your photo album
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
        event={selectedEvent}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
