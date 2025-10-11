import { Event } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { Calendar, MapPin, Users, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

interface EventCardProps {
  event: Event;
  distance?: number;
}

export function EventCard({ event, distance }: EventCardProps) {
  const eventDate = new Date(event.startDatetime);
  const sourceCount = event.sources?.length || 0;

  return (
    <Link href={`/events/${event.id}`}>
      <Card
        className="group hover-elevate active-elevate-2 cursor-pointer overflow-hidden transition-all"
        data-testid={`card-event-${event.id}`}
      >
        {event.imageUrl ? (
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute top-2 right-2">
              <ConfidenceBadge
                score={event.confidence}
                verificationStatus={event.verificationStatus}
                className="backdrop-blur-sm bg-background/80"
              />
            </div>
          </div>
        ) : (
          <div className="relative aspect-video w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <Users className="h-16 w-16 text-primary/20" />
            <div className="absolute top-2 right-2">
              <ConfidenceBadge
                score={event.confidence}
                verificationStatus={event.verificationStatus}
              />
            </div>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-2 flex-1" data-testid={`text-event-title-${event.id}`}>
              {event.title}
            </h3>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(eventDate, "EEE, MMM d 'at' h:mm a")}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.locationName}</span>
              {distance !== undefined && (
                <span className="ml-auto text-xs font-medium">
                  {distance.toFixed(1)} mi
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {event.isFree && (
              <Badge variant="secondary" className="text-xs">
                Free
              </Badge>
            )}
            {event.isFamilyFriendly && (
              <Badge variant="secondary" className="text-xs">
                Family-Friendly
              </Badge>
            )}
            {event.isOutdoor && (
              <Badge variant="secondary" className="text-xs">
                Outdoor
              </Badge>
            )}
            {event.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground pt-0">
          <span>By {event.organizerName}</span>
          {sourceCount > 0 && (
            <div className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              <span>{sourceCount} source{sourceCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
