import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { Event } from "@shared/schema";
import L from "leaflet";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { format } from "date-fns";
import { Link } from "wouter";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React-Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface EventMapProps {
  events: Event[];
  center: [number, number];
  zoom?: number;
  radius?: number;
  onMarkerClick?: (eventId: string) => void;
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

export function EventMap({
  events,
  center,
  zoom = 12,
  radius = 2,
  onMarkerClick,
}: EventMapProps) {
  const radiusInMeters = radius * 1609.34; // Convert miles to meters

  return (
    <div className="h-full w-full" data-testid="map-events">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full rounded-md"
        scrollWheelZoom={true}
      >
        <MapUpdater center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location circle */}
        <Circle
          center={center}
          radius={radiusInMeters}
          pathOptions={{
            fillColor: "hsl(var(--primary))",
            fillOpacity: 0.1,
            color: "hsl(var(--primary))",
            weight: 2,
          }}
        />

        {/* Event markers */}
        {events.map((event) => {
          const position: [number, number] = [
            parseFloat(event.lat),
            parseFloat(event.lng),
          ];

          // Custom icon based on verification status
          const markerColor =
            event.verificationStatus === "verified"
              ? "#22c55e"
              : event.verificationStatus === "flagged"
              ? "#ef4444"
              : "#f59e0b";

          const customIcon = L.divIcon({
            className: "custom-marker",
            html: `<div style="background-color: ${markerColor}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          });

          return (
            <Marker
              key={event.id}
              position={position}
              icon={customIcon}
              eventHandlers={{
                click: () => onMarkerClick?.(event.id),
              }}
            >
              <Popup>
                <div className="min-w-[200px] p-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-sm flex-1">{event.title}</h4>
                    <ConfidenceBadge
                      score={event.confidence}
                      verificationStatus={event.verificationStatus}
                      showLabel={false}
                      className="text-xs"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {event.description}
                  </p>
                  <p className="text-xs mb-1">
                    {format(new Date(event.startDatetime), "MMM d, h:mm a")}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {event.locationName}
                  </p>
                  <Link href={`/events/${event.id}`}>
                    <span className="text-xs text-primary hover:underline cursor-pointer">
                      View Details →
                    </span>
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
