import { type Event, type InsertEvent, type UpdateEventStatus, type FlagEvent, type EventSource } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Events
  getAllEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEventStatus(id: string, update: Omit<UpdateEventStatus, 'id'>): Promise<Event | undefined>;
  flagEvent(id: string, flagData: Omit<FlagEvent, 'id'>): Promise<Event | undefined>;
}

export class MemStorage implements IStorage {
  private events: Map<string, Event>;

  constructor() {
    this.events = new Map();
    this.seedData();
  }

  private seedData() {
    // Add some sample events for Charlotte
    const sampleEvents: Omit<Event, 'id'>[] = [
      {
        title: "Freedom Park Community Concert",
        description: "Join us for a free outdoor concert featuring local acoustic artists. Bring your blanket and enjoy an evening of music under the stars. Food trucks will be available.",
        startDatetime: new Date("2025-10-15T18:00:00-04:00"),
        endDatetime: new Date("2025-10-15T21:00:00-04:00"),
        timezone: "America/New_York",
        locationName: "Freedom Park",
        locationAddress: "1900 East Blvd, Charlotte, NC 28203",
        lat: "35.2042",
        lng: "-80.8426",
        organizerName: "Friends of Freedom Park",
        organizerWebsite: "https://friendsoffreedompark.org",
        organizerEmail: "info@friendsoffreedompark.org",
        contactPublic: true,
        tags: ["music", "outdoor", "community"],
        isFree: true,
        isFamilyFriendly: true,
        isOutdoor: true,
        sources: [
          { type: "city_calendar", url: "https://charlottenc.gov/events/freedom-park-concert" },
          { type: "local_news", url: "https://charlotteobserver.com/events/freedom-park" }
        ] as EventSource[],
        confidence: 95,
        verificationStatus: "verified",
        neighborhood: "Dilworth",
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=450&fit=crop",
        createdAt: new Date("2025-10-01T12:00:00-04:00"),
        lastCheckedAt: new Date("2025-10-10T09:00:00-04:00"),
        moderationNotes: null,
        flagReason: null,
      },
      {
        title: "Plaza Midwood Art Walk",
        description: "Monthly art walk through Plaza Midwood featuring local artists, galleries, and pop-up exhibitions. Meet artists, enjoy refreshments, and explore the vibrant art scene.",
        startDatetime: new Date("2025-10-20T17:00:00-04:00"),
        endDatetime: new Date("2025-10-20T21:00:00-04:00"),
        timezone: "America/New_York",
        locationName: "Central Avenue - Plaza Midwood",
        locationAddress: "1600 Central Ave, Charlotte, NC 28205",
        lat: "35.2220",
        lng: "-80.8050",
        organizerName: "Plaza Midwood Merchants Association",
        organizerWebsite: "https://plazamidwood.com",
        organizerEmail: "",
        contactPublic: false,
        tags: ["art", "culture", "walking"],
        isFree: true,
        isFamilyFriendly: true,
        isOutdoor: true,
        sources: [
          { type: "community_group", url: "https://plazamidwood.com/events" }
        ] as EventSource[],
        confidence: 88,
        verificationStatus: "verified",
        neighborhood: "Plaza Midwood",
        imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=450&fit=crop",
        createdAt: new Date("2025-09-28T10:00:00-04:00"),
        lastCheckedAt: new Date("2025-10-09T14:00:00-04:00"),
        moderationNotes: null,
        flagReason: null,
      },
      {
        title: "NoDa Neighborhood Cleanup",
        description: "Help keep NoDa beautiful! Join neighbors for a community cleanup day. We'll provide gloves, bags, and refreshments. Perfect for families wanting to give back.",
        startDatetime: new Date("2025-10-18T09:00:00-04:00"),
        endDatetime: new Date("2025-10-18T12:00:00-04:00"),
        timezone: "America/New_York",
        locationName: "NoDa Company Store",
        locationAddress: "3106 N Davidson St, Charlotte, NC 28205",
        lat: "35.2451",
        lng: "-80.8098",
        organizerName: "NoDa Neighborhood Association",
        organizerWebsite: "",
        organizerEmail: "cleanup@noda.org",
        contactPublic: false,
        tags: ["community", "volunteer", "outdoor"],
        isFree: true,
        isFamilyFriendly: true,
        isOutdoor: true,
        sources: [
          { type: "user_submission", url: "" }
        ] as EventSource[],
        confidence: 65,
        verificationStatus: "unverified",
        neighborhood: "NoDa",
        imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=450&fit=crop",
        createdAt: new Date("2025-10-08T16:00:00-04:00"),
        lastCheckedAt: new Date("2025-10-08T16:00:00-04:00"),
        moderationNotes: null,
        flagReason: null,
      },
      {
        title: "South End Farmers Market",
        description: "Weekly farmers market with local produce, artisan goods, baked items, and live music. Support local farmers and enjoy the community atmosphere.",
        startDatetime: new Date("2025-10-19T08:00:00-04:00"),
        endDatetime: new Date("2025-10-19T12:00:00-04:00"),
        timezone: "America/New_York",
        locationName: "Atherton Mill & Market",
        locationAddress: "2104 South Blvd, Charlotte, NC 28203",
        lat: "35.2070",
        lng: "-80.8640",
        organizerName: "Atherton Market",
        organizerWebsite: "https://athertonmill.com/market",
        organizerEmail: "",
        contactPublic: false,
        tags: ["market", "food", "local"],
        isFree: true,
        isFamilyFriendly: true,
        isOutdoor: true,
        sources: [
          { type: "city_calendar", url: "https://charlottenc.gov/events/atherton-market" }
        ] as EventSource[],
        confidence: 92,
        verificationStatus: "verified",
        neighborhood: "South End",
        imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=450&fit=crop",
        createdAt: new Date("2025-09-25T11:00:00-04:00"),
        lastCheckedAt: new Date("2025-10-11T08:00:00-04:00"),
        moderationNotes: null,
        flagReason: null,
      },
      {
        title: "Myers Park Library Story Time",
        description: "Interactive story time for children ages 2-5 with songs, crafts, and activities. No registration required. Join us for fun learning!",
        startDatetime: new Date("2025-10-17T10:30:00-04:00"),
        endDatetime: new Date("2025-10-17T11:30:00-04:00"),
        timezone: "America/New_York",
        locationName: "Myers Park Library",
        locationAddress: "310 E Worthington Ave, Charlotte, NC 28203",
        lat: "35.1950",
        lng: "-80.8340",
        organizerName: "Charlotte Mecklenburg Library",
        organizerWebsite: "https://cmlibrary.org",
        organizerEmail: "",
        contactPublic: false,
        tags: ["kids", "education", "library"],
        isFree: true,
        isFamilyFriendly: true,
        isOutdoor: false,
        sources: [
          { type: "library", url: "https://cmlibrary.org/events/story-time" }
        ] as EventSource[],
        confidence: 98,
        verificationStatus: "verified",
        neighborhood: "Myers Park",
        imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop",
        createdAt: new Date("2025-09-30T09:00:00-04:00"),
        lastCheckedAt: new Date("2025-10-10T10:00:00-04:00"),
        moderationNotes: null,
        flagReason: null,
      }
    ];

    sampleEvents.forEach(event => {
      const id = randomUUID();
      this.events.set(id, { ...event, id });
    });
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort(
      (a, b) => new Date(a.startDatetime).getTime() - new Date(b.startDatetime).getTime()
    );
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    
    // Calculate initial confidence based on provided information
    let confidence = 50; // Base confidence
    
    if (insertEvent.organizerWebsite) confidence += 15;
    if (insertEvent.organizerEmail) confidence += 10;
    if (insertEvent.neighborhood) confidence += 5;
    
    const event: Event = {
      ...insertEvent,
      id,
      sources: [{ type: "user_submission", url: "" }] as EventSource[],
      confidence: Math.min(confidence, 75), // User submissions max at 75
      verificationStatus: "unverified",
      createdAt: new Date(),
      lastCheckedAt: new Date(),
      moderationNotes: null,
      flagReason: null,
    };
    
    this.events.set(id, event);
    return event;
  }

  async updateEventStatus(
    id: string,
    update: Omit<UpdateEventStatus, 'id'>
  ): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;

    const updatedEvent: Event = {
      ...event,
      verificationStatus: update.verificationStatus,
      confidence: update.confidence ?? event.confidence,
      moderationNotes: update.moderationNotes ?? event.moderationNotes,
      lastCheckedAt: new Date(),
    };

    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async flagEvent(
    id: string,
    flagData: Omit<FlagEvent, 'id'>
  ): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;

    const updatedEvent: Event = {
      ...event,
      verificationStatus: "flagged",
      flagReason: flagData.flagReason,
      moderationNotes: flagData.notes ?? event.moderationNotes,
      lastCheckedAt: new Date(),
    };

    this.events.set(id, updatedEvent);
    return updatedEvent;
  }
}

export const storage = new MemStorage();
