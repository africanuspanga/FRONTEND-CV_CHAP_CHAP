import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { cvDataSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // CV Routes
  app.get("/api/cv", async (req, res) => {
    const cvs = await storage.getAllCVs();
    res.json(cvs);
  });

  app.get("/api/cv/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid CV ID" });
    }

    const cv = await storage.getCV(id);
    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }

    res.json(cv);
  });

  app.post("/api/cv", async (req, res) => {
    try {
      const data = cvDataSchema.parse(req.body.data);
      const templateId = z.string().parse(req.body.templateId);
      
      const cv = await storage.createCV({
        userId: null, // Anonymous CV creation
        templateId,
        data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      res.status(201).json(cv);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid CV data", 
          errors: error.errors 
        });
      }
      throw error;
    }
  });

  app.put("/api/cv/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid CV ID" });
      }

      const data = cvDataSchema.parse(req.body.data);
      const templateId = z.string().parse(req.body.templateId);
      
      const updatedCV = await storage.updateCV(id, {
        templateId,
        data,
        updatedAt: new Date().toISOString(),
      });

      if (!updatedCV) {
        return res.status(404).json({ message: "CV not found" });
      }

      res.json(updatedCV);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid CV data", 
          errors: error.errors 
        });
      }
      throw error;
    }
  });

  app.delete("/api/cv/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid CV ID" });
    }

    const result = await storage.deleteCV(id);
    if (!result) {
      return res.status(404).json({ message: "CV not found" });
    }

    res.status(204).send();
  });

  // Templates routes
  app.get("/api/templates", async (req, res) => {
    const templates = await storage.getAllTemplates();
    res.json(templates);
  });

  const httpServer = createServer(app);
  return httpServer;
}
