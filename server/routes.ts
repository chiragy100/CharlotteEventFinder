import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, updateEventStatusSchema, flagEventSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single event
  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create event
  app.post("/api/events", async (req, res) => {
    try {
      const validated = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validated);
      res.status(201).json(event);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Update event status (moderation)
  app.patch("/api/events/:id/status", async (req, res) => {
    try {
      const validated = updateEventStatusSchema.parse({
        ...req.body,
        id: req.params.id,
      });

      const event = await storage.updateEventStatus(validated.id, {
        verificationStatus: validated.verificationStatus,
        confidence: validated.confidence,
        moderationNotes: validated.moderationNotes,
      });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(event);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Flag event
  app.post("/api/events/flag", async (req, res) => {
    try {
      const validated = flagEventSchema.parse(req.body);
      const event = await storage.flagEvent(validated.id, {
        flagReason: validated.flagReason,
        notes: validated.notes,
      });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(event);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Simple geocoding endpoint (approximation for Charlotte area)
  app.post("/api/geocode", async (req, res) => {
    try {
      const { address } = req.body;
      
      if (!address) {
        return res.status(400).json({ message: "Address is required" });
      }

      // Simple geocoding - in production, use a real geocoding service
      // For now, we'll return Charlotte center with slight variations
      const baseLatitude = 35.2271;
      const baseLongitude = -80.8431;
      
      // Add small random offset to simulate different locations
      const latOffset = (Math.random() - 0.5) * 0.1;
      const lngOffset = (Math.random() - 0.5) * 0.1;

      res.json({
        lat: (baseLatitude + latOffset).toFixed(6),
        lng: (baseLongitude + lngOffset).toFixed(6),
        approximation: true,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
