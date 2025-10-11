import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Event, UpdateEventStatus } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBadge } from "@/components/confidence-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Eye, Shield } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function AdminModeration() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [confidence, setConfidence] = useState<string>("");
  const [moderationNotes, setModerationNotes] = useState("");

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (data: UpdateEventStatus) => {
      return apiRequest("PATCH", `/api/events/${data.id}/status`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Status Updated",
        description: "Event status has been updated successfully.",
      });
      setDialogOpen(false);
      setSelectedEvent(null);
      setNewStatus("");
      setConfidence("");
      setModerationNotes("");
    },
  });

  const filteredEvents = events.filter((event) => {
    if (statusFilter === "all") return true;
    return event.verificationStatus === statusFilter;
  });

  const stats = {
    total: events.length,
    verified: events.filter((e) => e.verificationStatus === "verified").length,
    unverified: events.filter((e) => e.verificationStatus === "unverified")
      .length,
    flagged: events.filter((e) => e.verificationStatus === "flagged").length,
    avgConfidence:
      events.length > 0
        ? Math.round(
            events.reduce((sum, e) => sum + e.confidence, 0) / events.length
          )
        : 0,
  };

  const handleUpdateStatus = () => {
    if (!selectedEvent || !newStatus) return;

    const data: UpdateEventStatus = {
      id: selectedEvent.id,
      verificationStatus: newStatus as any,
      confidence: confidence ? parseInt(confidence) : undefined,
      moderationNotes: moderationNotes || undefined,
    };

    updateStatusMutation.mutate(data);
  };

  const openUpdateDialog = (event: Event) => {
    setSelectedEvent(event);
    setNewStatus(event.verificationStatus);
    setConfidence(event.confidence.toString());
    setModerationNotes(event.moderationNotes || "");
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Moderation Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Review and verify submitted events to maintain quality and trust.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Events</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Verified</CardDescription>
              <CardTitle className="text-3xl text-success">
                {stats.verified}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Unverified</CardDescription>
              <CardTitle className="text-3xl text-warning">
                {stats.unverified}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Flagged</CardDescription>
              <CardTitle className="text-3xl text-destructive">
                {stats.flagged}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Confidence</CardDescription>
              <CardTitle className="text-3xl">{stats.avgConfidence}%</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <Label>Filter by Status:</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]" data-testid="select-status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No events found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Organizer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium line-clamp-1">
                              {event.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {event.locationName}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(event.startDatetime), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-sm">
                          {event.organizerName}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              event.verificationStatus === "verified"
                                ? "default"
                                : event.verificationStatus === "flagged"
                                ? "destructive"
                                : "secondary"
                            }
                            className={
                              event.verificationStatus === "verified"
                                ? "bg-success text-success-foreground"
                                : event.verificationStatus === "unverified"
                                ? "bg-warning text-warning-foreground"
                                : ""
                            }
                          >
                            {event.verificationStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <ConfidenceBadge
                            score={event.confidence}
                            verificationStatus={event.verificationStatus}
                            showLabel={false}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/events/${event.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                data-testid={`button-view-${event.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openUpdateDialog(event)}
                              data-testid={`button-moderate-${event.id}`}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Status Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Event</DialogTitle>
              <DialogDescription>
                Update the verification status and confidence score for this event.
              </DialogDescription>
            </DialogHeader>

            {selectedEvent && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="font-semibold mb-2">{selectedEvent.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedEvent.description}
                  </p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>{selectedEvent.organizerName}</span>
                    <span>•</span>
                    <span>
                      {format(
                        new Date(selectedEvent.startDatetime),
                        "MMM d, yyyy"
                      )}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Verification Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger id="status" data-testid="select-new-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="unverified">Unverified</SelectItem>
                        <SelectItem value="flagged">Flagged</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confidence">Confidence Score (0-100)</Label>
                    <Input
                      id="confidence"
                      type="number"
                      min="0"
                      max="100"
                      value={confidence}
                      onChange={(e) => setConfidence(e.target.value)}
                      data-testid="input-confidence"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Moderation Notes</Label>
                  <Textarea
                    id="notes"
                    value={moderationNotes}
                    onChange={(e) => setModerationNotes(e.target.value)}
                    placeholder="Add notes about your decision..."
                    rows={3}
                    data-testid="textarea-moderation-notes"
                  />
                </div>

                {selectedEvent.flagReason && (
                  <div className="p-3 bg-destructive/10 rounded-md">
                    <p className="text-sm font-medium text-destructive mb-1">
                      Flag Reason: {selectedEvent.flagReason}
                    </p>
                    {selectedEvent.moderationNotes && (
                      <p className="text-xs text-muted-foreground">
                        {selectedEvent.moderationNotes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                data-testid="button-cancel-review"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateStatus}
                disabled={!newStatus || updateStatusMutation.isPending}
                data-testid="button-save-review"
              >
                {updateStatusMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
