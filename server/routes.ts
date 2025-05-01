import type { Express } from "express";
import { createServer, type Server } from "http";
import * as templateAPI from "./api/templates";
import * as cvAPI from "./api/cv";
import * as simpleCvAPI from "./api/simple-cv";
import { storage } from "./storage";
import { cvDataSchema } from "@shared/schema";
import { z } from "zod";

// Type declarations for Express Request (isAuthenticated & user) are in server/types/express.d.ts

export async function registerRoutes(app: Express): Promise<Server> {

  // Template routes
  app.get("/api/cv/templates", templateAPI.getAllTemplates);
  app.get("/api/cv/templates/:id", templateAPI.getTemplateById);
  
  // Admin template management routes
  app.post("/api/admin/templates", templateAPI.createTemplate);
  app.put("/api/admin/templates/:id", templateAPI.updateTemplate);
  app.delete("/api/admin/templates/:id", templateAPI.deleteTemplate);
  
  // CV routes
  app.get("/api/cv/:id", simpleCvAPI.getCV);
  app.post("/api/cv", simpleCvAPI.createCV);
  app.get("/api/cv", simpleCvAPI.getAllCVs);
  
  // CV preview routes
  app.get("/api/cv/:id/preview", simpleCvAPI.getCVPreview);
  app.get("/api/cv/:id/html-preview", cvAPI.getHTMLPreview);
  
  // Payment and download routes
  app.get("/api/cv/:id/payment-status", cvAPI.checkPaymentStatus);
  app.post("/api/cv/:id/generate-pdf", cvAPI.generatePDF);
  app.get("/api/cv/:id/document-status/:taskId", cvAPI.checkDocumentStatus);
  
  // Legacy routes for compatibility (can be removed later)
  app.get("/api/cv", async (req, res) => {
    const cvs = await storage.getAllCVs();
    res.json(cvs);
  });
  
  app.get("/api/templates", templateAPI.getAllTemplates);

  const httpServer = createServer(app);
  return httpServer;
}
