import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Event, FlagEvent } from "@shared/schema";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Globe,
  Mail,
  Flag,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { EventMap } from "@/components/event-map";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function EventDetail() {
  const [, params] = useRoute("/events/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [flagReason, setFlagReason] = useState<string>("");
  const [flagNotes, setFlagNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ["/api/events", params?.id],
    queryFn: async () => {
      const response = await fetch(`/api/events/${params?.id}`);
      if (!response.ok) {
        throw new Error('Event not found');
      }
      return response.json();
    },
    enabled: !!params?.id,
  });

  const flagMutation = useMutation({
    mutationFn: async (data: FlagEvent) => {
      return apiRequest("POST", "/api/events/flag", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Event Flagged",
        description: "This event has been flagged for review.",
      });
      setDialogOpen(false);
      setFlagReason("");
      setFlagNotes("");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The event you're looking for doesn't exist.
        </p>
        <Button onClick={() => setLocation("/")}>Back to Home</Button>
      </div>
    );
  }

  const eventDate = new Date(event.startDatetime);
  const eventEndDate = new Date(event.endDatetime);

  const handleFlag = () => {
    if (!flagReason) return;
    flagMutation.mutate({
      id: event.id,
      flagReason: flagReason as any,
      notes: flagNotes || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-[40vh] bg-gradient-to-br from-primary/20 to-primary/5">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Users className="h-32 w-32 text-primary/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>

          {/* Main Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-3">{event.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <ConfidenceBadge
                      score={event.confidence}
                      verificationStatus={event.verificationStatus}
                    />
                    {event.isFree && <Badge>Free</Badge>}
                    {event.isFamilyFriendly && <Badge>Family-Friendly</Badge>}
                    {event.isOutdoor && <Badge>Outdoor</Badge>}
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" data-testid="button-flag-event">
                      <Flag className="h-4 w-4 mr-2" />
                      Report Problem
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report a Problem</DialogTitle>
                      <DialogDescription>
                        Help us keep event information accurate and safe.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Select value={flagReason} onValueChange={setFlagReason}>
                          <SelectTrigger id="reason" data-testid="select-flag-reason">
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="outdated">Event is Outdated</SelectItem>
                            <SelectItem value="spam">Spam</SelectItem>
                            <SelectItem value="incorrect_location">
                              Incorrect Location
                            </SelectItem>
                            <SelectItem value="safety_risk">Safety Risk</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Details (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={flagNotes}
                          onChange={(e) => setFlagNotes(e.target.value)}
                          placeholder="Provide more details..."
                          data-testid="textarea-flag-notes"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleFlag}
                        disabled={!flagReason || flagMutation.isPending}
                        data-testid="button-submit-flag"
                      >
                        {flagMutation.isPending ? "Submitting..." : "Submit Report"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg">{event.description}</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {format(eventDate, "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(eventDate, "h:mm a")} - {format(eventEndDate, "h:mm a")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{event.locationName}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.locationAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Organizer</p>
                    <p className="text-sm text-muted-foreground">
                      {event.organizerName}
                    </p>
                  </div>
                </div>

                {event.organizerWebsite && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a
                        href={event.organizerWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        Visit Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] rounded-md overflow-hidden">
                <EventMap
                  events={[event]}
                  center={[parseFloat(event.lat), parseFloat(event.lng)]}
                  zoom={14}
                  radius={0.5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Provenance */}
          {event.sources && event.sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Event Sources & Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This event information was verified using the following sources:
                </p>
                <div className="space-y-2">
                  {event.sources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-md bg-muted/50"
                    >
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium capitalize">
                          {source.type.replace("_", " ")}
                        </p>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline truncate block"
                        >
                          {source.url}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Last verified:{" "}
                  {format(new Date(event.lastCheckedAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
