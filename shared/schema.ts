import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Events table
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startDatetime: timestamp("start_datetime", { withTimezone: true }).notNull(),
  endDatetime: timestamp("end_datetime", { withTimezone: true }).notNull(),
  timezone: text("timezone").notNull().default("America/New_York"),
  locationName: text("location_name").notNull(),
  locationAddress: text("location_address").notNull(),
  lat: text("lat").notNull(),
  lng: text("lng").notNull(),
  organizerName: text("organizer_name").notNull(),
  organizerWebsite: text("organizer_website"),
  organizerEmail: text("organizer_email"),
  contactPublic: boolean("contact_public").notNull().default(false),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  isFree: boolean("is_free").notNull().default(true),
  isFamilyFriendly: boolean("is_family_friendly").notNull().default(false),
  isOutdoor: boolean("is_outdoor").notNull().default(false),
  sources: jsonb("sources").$type<EventSource[]>().notNull().default(sql`'[]'::jsonb`),
  confidence: integer("confidence").notNull().default(50),
  verificationStatus: text("verification_status").notNull().default("unverified"),
  neighborhood: text("neighborhood"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }).notNull().default(sql`now()`),
  moderationNotes: text("moderation_notes"),
  flagReason: text("flag_reason"),
});

// Type for event sources
export type EventSource = {
  type: "city_calendar" | "library" | "local_news" | "community_group" | "user_submission" | "other";
  url: string;
  cachedSnapshot?: string;
};

// Insert schema for events
export const insertEventSchema = createInsertSchema(events, {
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000),
  startDatetime: z.coerce.date(),
  endDatetime: z.coerce.date(),
  locationName: z.string().min(3),
  locationAddress: z.string().min(5),
  lat: z.string().regex(/^-?\d+\.?\d*$/, "Invalid latitude"),
  lng: z.string().regex(/^-?\d+\.?\d*$/, "Invalid longitude"),
  organizerName: z.string().min(2),
  organizerWebsite: z.string().url().optional().or(z.literal("")),
  organizerEmail: z.string().email().optional().or(z.literal("")),
  tags: z.array(z.string()).max(5).default([]),
  isFree: z.boolean().default(true),
  isFamilyFriendly: z.boolean().default(false),
  isOutdoor: z.boolean().default(false),
  neighborhood: z.string().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
}).omit({
  id: true,
  createdAt: true,
  lastCheckedAt: true,
  sources: true,
  confidence: true,
  verificationStatus: true,
  moderationNotes: true,
  flagReason: true,
});

// Update schema for moderation
export const updateEventStatusSchema = z.object({
  id: z.string(),
  verificationStatus: z.enum(["verified", "unverified", "flagged"]),
  confidence: z.number().min(0).max(100).optional(),
  moderationNotes: z.string().optional(),
});

// Flag event schema
export const flagEventSchema = z.object({
  id: z.string(),
  flagReason: z.enum(["outdated", "spam", "incorrect_location", "safety_risk", "other"]),
  notes: z.string().optional(),
});

// Filter schema for events
export const eventFiltersSchema = z.object({
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  radius: z.number().min(1).max(10).default(2),
  isFree: z.boolean().optional(),
  isFamilyFriendly: z.boolean().optional(),
  isOutdoor: z.boolean().optional(),
  verifiedOnly: z.boolean().optional(),
  neighborhood: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type UpdateEventStatus = z.infer<typeof updateEventStatusSchema>;
export type FlagEvent = z.infer<typeof flagEventSchema>;
export type EventFilters = z.infer<typeof eventFiltersSchema>;
