
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar, Image as ImageIcon } from "lucide-react";
import { EventData } from "@/components/events/EventModal";
import { PhotoData } from "@/components/photos/PhotoModal";

interface LoveMapProps {
  events: EventData[];
  photos: PhotoData[];
  onEventClick?: (event: EventData) => void;
  onPhotoClick?: (photo: PhotoData) => void;
}

interface LocationData {
  lat: number;
  lng: number;
  events: EventData[];
  photos: PhotoData[];
  frequency: number;
}

const LoveMap = ({ events, photos, onEventClick, onPhotoClick }: LoveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [locationGroups, setLocationGroups] = useState<LocationData[]>([]);

  useEffect(() => {
    // Group events and photos by location
    const locationMap = new Map<string, LocationData>();

    // Process events
    events.forEach(event => {
      if (event.coordinates) {
        const key = `${event.coordinates.lat.toFixed(4)},${event.coordinates.lng.toFixed(4)}`;
        if (!locationMap.has(key)) {
          locationMap.set(key, {
            lat: event.coordinates.lat,
            lng: event.coordinates.lng,
            events: [],
            photos: [],
            frequency: 0
          });
        }
        const location = locationMap.get(key)!;
        location.events.push(event);
        location.frequency++;
      }
    });

    // Process photos
    photos.forEach(photo => {
      if (photo.coordinates) {
        const key = `${photo.coordinates.lat.toFixed(4)},${photo.coordinates.lng.toFixed(4)}`;
        if (!locationMap.has(key)) {
          locationMap.set(key, {
            lat: photo.coordinates.lat,
            lng: photo.coordinates.lng,
            events: [],
            photos: [],
            frequency: 0
          });
        }
        const location = locationMap.get(key)!;
        location.photos.push(photo);
        location.frequency++;
      }
    });

    setLocationGroups(Array.from(locationMap.values()));
  }, [events, photos]);

  const getMarkerSize = (frequency: number) => {
    if (frequency >= 5) return "h-8 w-8";
    if (frequency >= 3) return "h-6 w-6";
    return "h-4 w-4";
  };

  const getMarkerColor = (location: LocationData) => {
    if (location.events.length > 0 && location.photos.length > 0) {
      return "text-purple-500"; // Both events and photos
    } else if (location.events.length > 0) {
      return "text-blue-500"; // Only events
    } else {
      return "text-love-500"; // Only photos
    }
  };

  if (locationGroups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-love-500" />
            Love Map
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Add locations to your events and photos to see them on the love map!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-love-500" />
          Love Map
          <span className="text-sm font-normal text-muted-foreground">
            ({locationGroups.length} locations)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Simple visual map representation */}
          <div className="relative bg-gradient-to-br from-blue-50 to-love-50 rounded-lg p-6 min-h-[300px] border-2 border-dashed border-love-200">
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              {locationGroups.map((location, index) => (
                <div
                  key={index}
                  className={`absolute cursor-pointer transition-transform hover:scale-110`}
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                  }}
                  onClick={() => setSelectedLocation(location)}
                >
                  <Heart
                    className={`${getMarkerSize(location.frequency)} ${getMarkerColor(location)} drop-shadow-lg`}
                    fill="currentColor"
                  />
                  <div className="absolute -top-1 -right-1 bg-white rounded-full text-xs w-5 h-5 flex items-center justify-center border border-gray-300 text-gray-600">
                    {location.frequency}
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              Click hearts to see details
            </div>
          </div>

          {/* Location details */}
          <div className="space-y-3">
            {selectedLocation ? (
              <div>
                <h3 className="font-semibold text-sm mb-2">
                  Location Details
                </h3>
                <div className="text-xs text-muted-foreground mb-3">
                  {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </div>

                {selectedLocation.events.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-1 mb-2">
                      <Calendar className="h-3 w-3 text-blue-500" />
                      <span className="text-sm font-medium">Events ({selectedLocation.events.length})</span>
                    </div>
                    <div className="space-y-1">
                      {selectedLocation.events.map(event => (
                        <Button
                          key={event.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-auto p-2 text-left"
                          onClick={() => onEventClick?.(event)}
                        >
                          <div>
                            <div className="font-medium text-xs">{event.title}</div>
                            <div className="text-xs text-muted-foreground">{event.date}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedLocation.photos.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <ImageIcon className="h-3 w-3 text-love-500" />
                      <span className="text-sm font-medium">Photos ({selectedLocation.photos.length})</span>
                    </div>
                    <div className="space-y-1">
                      {selectedLocation.photos.map(photo => (
                        <Button
                          key={photo.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-auto p-2 text-left"
                          onClick={() => onPhotoClick?.(photo)}
                        >
                          <div>
                            <div className="font-medium text-xs">{photo.title}</div>
                            <div className="text-xs text-muted-foreground">{photo.date}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a location on the map to see details</p>
              </div>
            )}

            {/* Legend */}
            <div className="border-t pt-3 mt-4">
              <div className="text-xs font-medium mb-2">Legend</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <Heart className="h-3 w-3 text-blue-500" fill="currentColor" />
                  <span>Events only</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-3 w-3 text-love-500" fill="currentColor" />
                  <span>Photos only</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-3 w-3 text-purple-500" fill="currentColor" />
                  <span>Events & Photos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoveMap;
