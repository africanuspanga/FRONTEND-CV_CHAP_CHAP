import { 
  users, 
  templates as templateTable,
  cvs as cvsTable,
  payments as paymentsTable,
  type User, 
  type InsertUser, 
  type CV, 
  type InsertCV,
  type Template,
  type InsertTemplate,
  type Payment,
  type InsertPayment,
  type CVData
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { v4 as uuidv4 } from "uuid";

// Import session store for authentication
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// The Template interface is already defined in our schema.ts file
// We'll use that instead of this one

export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // CV methods
  getCV(id: string): Promise<CV | undefined>;
  getCVsByUserId(userId: number): Promise<CV[]>;
  getAllCVs(): Promise<CV[]>;
  createCV(cv: Omit<InsertCV, 'id'>): Promise<CV>;
  // Create a CV bypassing userId foreign key constraint for anonymous users
  createRawCV(cv: { id: string, templateId: string, cvData: string, userId?: number }): Promise<CV>;
  updateCV(id: string, updateData: Partial<Omit<CV, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<CV | undefined>;
  deleteCV(id: string): Promise<boolean>;
  
  // Template methods
  getTemplate(id: string): Promise<Template | undefined>;
  getAllTemplates(): Promise<Template[]>;
  createTemplate(template: Omit<InsertTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template>;
  updateTemplate(id: string, updateData: Partial<Omit<Template, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Template | undefined>;
  deleteTemplate(id: string): Promise<boolean>;
  
  // Payment methods
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentsByCVId(cvId: string): Promise<Payment[]>;
  getPaymentsByUserId(userId: number): Promise<Payment[]>;
  createPayment(payment: Omit<InsertPayment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment>;
  updatePayment(id: string, updateData: Partial<Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Payment | undefined>;
  checkPaymentStatus(cvId: string, userId: number): Promise<{ status: string; hasPayment: boolean; paymentUrl?: string; }>;
}

// We'll import the DatabaseStorage to replace MemStorage
import { DatabaseStorage } from "./database-storage";

// We'll still keep MemStorage for compatibility and testing purposes
export class MemStorage implements IStorage {
  sessionStore: session.Store;
  private users: Map<number, User>;
  private cvs: Map<string, CV>;
  private templates: Map<string, Template>;
  private payments: Map<string, Payment>;
  private userCurrentId: number;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    this.users = new Map();
    this.cvs = new Map();
    this.templates = new Map();
    this.payments = new Map();
    this.userCurrentId = 1;

    // Initialize with default template data
    const defaultTemplates = [
      {
        id: "moonlightSonata",
        name: "Moonlight Sonata",
        description: "A modern template with a warm orange sidebar and clean layout",
        htmlContent: "<div class='moonlight-sonata'>...</div>",
        cssContent: ".moonlight-sonata { ... }",
        previewImage: "/templates/moonlight-sonata-thumbnail.svg",
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "tanzanite",
        name: "Tanzanite",
        description: "Professional template with blue accents and structured sections",
        htmlContent: "<div class='tanzanite'>...</div>",
        cssContent: ".tanzanite { ... }",
        previewImage: "/templates/tanzanite-thumbnail.svg",
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "safariPro",
        name: "Safari Pro",
        description: "Bold design with earthy tones inspired by African landscapes",
        htmlContent: "<div class='safari-pro'>...</div>",
        cssContent: ".safari-pro { ... }",
        previewImage: "/templates/safari-pro-thumbnail.svg",
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "mwalimuClassic",
        name: "Mwalimu Classic",
        description: "Traditional academic-style template for educational professionals",
        htmlContent: "<div class='mwalimu-classic'>...</div>",
        cssContent: ".mwalimu-classic { ... }",
        previewImage: "/templates/mwalimu-classic-thumbnail.svg",
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Add templates to map
    for (const template of defaultTemplates) {
      this.templates.set(template.id, template as Template);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.users.set(id, user);
    return user;
  }

  // CV methods
  async getCV(id: string): Promise<CV | undefined> {
    return this.cvs.get(id);
  }

  async getCVsByUserId(userId: number): Promise<CV[]> {
    return Array.from(this.cvs.values()).filter(cv => cv.userId === userId);
  }

  async getAllCVs(): Promise<CV[]> {
    return Array.from(this.cvs.values());
  }

  async createCV(cv: Omit<InsertCV, 'id'>): Promise<CV> {
    const id = uuidv4();
    const now = new Date();
    const newCV: CV = { 
      ...cv as any, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.cvs.set(id, newCV);
    return newCV;
  }

  async createRawCV(cv: { id: string, templateId: string, cvData: string, userId?: number }): Promise<CV> {
    const now = new Date();
    const newCV: CV = { 
      ...cv as any,
      createdAt: now, 
      updatedAt: now 
    };
    this.cvs.set(cv.id, newCV);
    return newCV;
  }

  async updateCV(
    id: string, 
    updateData: Partial<Omit<CV, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<CV | undefined> {
    const existingCV = this.cvs.get(id);
    
    if (!existingCV) {
      return undefined;
    }
    
    const updatedCV: CV = { 
      ...existingCV, 
      ...updateData as any, 
      updatedAt: new Date() 
    };
    this.cvs.set(id, updatedCV);
    
    return updatedCV;
  }

  async deleteCV(id: string): Promise<boolean> {
    return this.cvs.delete(id);
  }

  // Template methods
  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async createTemplate(template: Omit<InsertTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    const id = uuidv4();
    const now = new Date();
    const newTemplate: Template = {
      ...template as any,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  async updateTemplate(
    id: string,
    updateData: Partial<Omit<Template, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Template | undefined> {
    const existingTemplate = this.templates.get(id);
    
    if (!existingTemplate) {
      return undefined;
    }
    
    const updatedTemplate: Template = {
      ...existingTemplate,
      ...updateData as any,
      updatedAt: new Date()
    };
    this.templates.set(id, updatedTemplate);
    
    return updatedTemplate;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    return this.templates.delete(id);
  }

  // Payment methods
  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getPaymentsByCVId(cvId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(payment => payment.cvId === cvId);
  }

  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(payment => payment.userId === userId);
  }

  async createPayment(payment: Omit<InsertPayment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const id = uuidv4();
    const now = new Date();
    const newPayment: Payment = {
      ...payment as any,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.payments.set(id, newPayment);
    return newPayment;
  }

  async updatePayment(
    id: string,
    updateData: Partial<Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Payment | undefined> {
    const existingPayment = this.payments.get(id);
    
    if (!existingPayment) {
      return undefined;
    }
    
    const updatedPayment: Payment = {
      ...existingPayment,
      ...updateData as any,
      updatedAt: new Date()
    };
    this.payments.set(id, updatedPayment);
    
    return updatedPayment;
  }

  async checkPaymentStatus(cvId: string, userId: number): Promise<{ status: string; hasPayment: boolean; paymentUrl?: string; }> {
    const payments = Array.from(this.payments.values()).filter(
      payment => payment.cvId === cvId && payment.userId === userId
    );

    // If no payments exist
    if (payments.length === 0) {
      return { 
        status: 'no_payment', 
        hasPayment: false,
        paymentUrl: `/payments/new?cv_id=${cvId}` 
      };
    }

    // Check for completed payments
    const completedPayment = payments.find(p => p.status === 'completed');
    if (completedPayment) {
      return { status: 'completed', hasPayment: true };
    }

    // Check for pending payments
    const pendingPayment = payments.find(p => p.status === 'pending');
    if (pendingPayment) {
      return { 
        status: 'pending', 
        hasPayment: false,
        paymentUrl: `/payments/check/${pendingPayment.id}`
      };
    }

    // If all payments have failed
    return { 
      status: 'failed', 
      hasPayment: false,
      paymentUrl: `/payments/new?cv_id=${cvId}` 
    };
  }
}

// Use DatabaseStorage for the real application
export const storage = new DatabaseStorage();
