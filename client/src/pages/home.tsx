import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { EventCard } from "@/components/event-card";
import { EventMap } from "@/components/event-map";
import { EventFilters } from "@/components/event-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Map, List, Plus, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { calculateDistance, CHARLOTTE_CENTER } from "@/lib/utils/distance";
import { useLocation } from "wouter";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Home() {
  const [, setLocation] = useLocation();
  const [view, setView] = useState<"map" | "list">("map");
  const [userLocation, setUserLocation] = useState<[number, number]>(CHARLOTTE_CENTER);
  const [filters, setFilters] = useState({
    search: "",
    radius: 2,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    isFree: undefined as boolean | undefined,
    isFamilyFriendly: undefined as boolean | undefined,
    isOutdoor: undefined as boolean | undefined,
    verifiedOnly: undefined as boolean | undefined,
  });

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  // Filter events based on filters and distance
  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        // Search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          if (
            !event.title.toLowerCase().includes(searchLower) &&
            !event.locationName.toLowerCase().includes(searchLower) &&
            !event.description.toLowerCase().includes(searchLower)
          ) {
            return false;
          }
        }

        // Distance filter
        const distance = calculateDistance(
          userLocation[0],
          userLocation[1],
          parseFloat(event.lat),
          parseFloat(event.lng)
        );
        if (distance > filters.radius) return false;

        // Date filters
        if (filters.startDate) {
          const eventDate = new Date(event.startDatetime);
          if (eventDate < filters.startDate) return false;
        }
        if (filters.endDate) {
          const eventDate = new Date(event.startDatetime);
          if (eventDate > filters.endDate) return false;
        }

        // Type filters
        if (filters.isFree !== undefined && event.isFree !== filters.isFree)
          return false;
        if (
          filters.isFamilyFriendly !== undefined &&
          event.isFamilyFriendly !== filters.isFamilyFriendly
        )
          return false;
        if (
          filters.isOutdoor !== undefined &&
          event.isOutdoor !== filters.isOutdoor
        )
          return false;
        if (
          filters.verifiedOnly &&
          event.verificationStatus !== "verified"
        )
          return false;

        return true;
      })
      .map((event) => ({
        ...event,
        distance: calculateDistance(
          userLocation[0],
          userLocation[1],
          parseFloat(event.lat),
          parseFloat(event.lng)
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [events, filters, userLocation]);

  const clearFilters = () => {
    setFilters({
      search: "",
      radius: 2,
      startDate: undefined,
      endDate: undefined,
      isFree: undefined,
      isFamilyFriendly: undefined,
      isOutdoor: undefined,
      verifiedOnly: undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Q0EzQUYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAzNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Discover Your Neighborhood
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find trusted, verified local events in Charlotte - block parties, markets, concerts, and more
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search events near you..."
                className="pl-10 h-12 text-base"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                data-testid="input-hero-search"
              />
            </div>
            <Button
              size="lg"
              onClick={() => setLocation("/submit")}
              className="h-12 gap-2"
              data-testid="button-submit-event"
            >
              <Plus className="h-5 w-5" />
              Submit Event
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mt-6">
            <Badge
              variant="secondary"
              className="cursor-pointer hover-elevate"
              onClick={() => setFilters({ ...filters, isFree: true })}
            >
              Free Events
            </Badge>
            <Badge
              variant="secondary"
              className="cursor-pointer hover-elevate"
              onClick={() => setFilters({ ...filters, isFamilyFriendly: true })}
            >
              Family-Friendly
            </Badge>
            <Badge
              variant="secondary"
              className="cursor-pointer hover-elevate"
              onClick={() => setFilters({ ...filters, verifiedOnly: true })}
            >
              Verified Only
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {filteredEvents.length} Event{filteredEvents.length !== 1 ? "s" : ""} Found
            </h2>
            <p className="text-sm text-muted-foreground">
              Within {filters.radius} miles of your location
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={view === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("map")}
              data-testid="button-view-map"
            >
              <Map className="h-4 w-4 mr-2" />
              Map
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("list")}
              data-testid="button-view-list"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-4">
              <EventFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Filters Sheet - Mobile */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full" data-testid="button-filters-mobile">
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <EventFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClearFilters={clearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Events Display */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : view === "map" ? (
              <div className="h-[600px] rounded-md overflow-hidden border">
                <EventMap
                  events={filteredEvents}
                  center={userLocation}
                  radius={filters.radius}
                  onMarkerClick={(id) => setLocation(`/events/${id}`)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredEvents.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">
                      No events found. Try adjusting your filters.
                    </p>
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      distance={event.distance}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
