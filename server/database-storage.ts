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
  type InsertPayment
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import { db } from "./db";
import { v4 as uuidv4 } from "uuid";
import { IStorage } from "./storage";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async getUserByPhoneNumber(phone_number: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone_number, phone_number));
    return user;
  }
  
  async getUserByResetToken(reset_token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.reset_token, reset_token));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = uuidv4();
    const [user] = await db.insert(users).values({
      ...insertUser, 
      id,
      username: insertUser.username || null,
      full_name: insertUser.full_name || null,
      phone_number: insertUser.phone_number || null,
      reset_token: null,
      reset_token_expires: null,
      last_login: null
    }).returning();
    return user;
  }
  
  async updateUser(id: string, updateData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
      
    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    return updatedUser;
  }

  // CV methods
  async getCV(id: string): Promise<CV | undefined> {
    const [cv] = await db.select().from(cvsTable).where(eq(cvsTable.id, id));
    return cv;
  }

  async getCVsByUserId(userId: string): Promise<CV[]> {
    return await db.select().from(cvsTable).where(eq(cvsTable.userId, userId));
  }

  async getAllCVs(): Promise<CV[]> {
    return await db.select().from(cvsTable).orderBy(desc(cvsTable.updatedAt));
  }

  async createCV(cv: Omit<InsertCV, 'id'>): Promise<CV> {
    const id = uuidv4();
    const [newCV] = await db.insert(cvsTable).values({ ...cv, id }).returning();
    return newCV;
  }

  async createRawCV(cv: { id: string, templateId: string, cvData: string, userId?: string }): Promise<CV> {
    const now = new Date();
    // Use raw SQL for direct insertion without FK constraint
    const query = `
      INSERT INTO cvs (id, template_id, cv_data, user_id, created_at, updated_at)
      VALUES ('${cv.id}', '${cv.templateId}', '${cv.cvData.replace(/'/g, "''")}', NULL, '${now.toISOString()}', '${now.toISOString()}')
      RETURNING *;
    `;
    
    const result = await db.execute(query);
    if (result.rows && result.rows.length > 0) {
      return result.rows[0] as CV;
    }
    
    throw new Error('Failed to create anonymous CV');
  }

  async updateCV(
    id: string, 
    updateData: Partial<Omit<CV, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<CV | undefined> {
    const [updatedCV] = await db
      .update(cvsTable)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(cvsTable.id, id))
      .returning();
    return updatedCV;
  }

  async deleteCV(id: string): Promise<boolean> {
    const [deletedCV] = await db
      .delete(cvsTable)
      .where(eq(cvsTable.id, id))
      .returning({ id: cvsTable.id });
    return !!deletedCV;
  }

  // Template methods
  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db
      .select()
      .from(templateTable)
      .where(eq(templateTable.id, id));
    return template;
  }

  async getAllTemplates(): Promise<Template[]> {
    return await db.select().from(templateTable);
  }

  async createTemplate(template: Omit<InsertTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    const id = uuidv4();
    const [newTemplate] = await db
      .insert(templateTable)
      .values({ ...template, id })
      .returning();
    return newTemplate;
  }

  async updateTemplate(
    id: string,
    updateData: Partial<Omit<Template, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Template | undefined> {
    const [updatedTemplate] = await db
      .update(templateTable)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(templateTable.id, id))
      .returning();
    return updatedTemplate;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const [deletedTemplate] = await db
      .delete(templateTable)
      .where(eq(templateTable.id, id))
      .returning({ id: templateTable.id });
    return !!deletedTemplate;
  }

  // Payment methods
  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.id, id));
    return payment;
  }

  async getPaymentsByCVId(cvId: string): Promise<Payment[]> {
    return await db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.cvId, cvId));
  }

  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    return await db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.userId, userId));
  }

  async createPayment(payment: Omit<InsertPayment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const id = uuidv4();
    const [newPayment] = await db
      .insert(paymentsTable)
      .values({ ...payment, id })
      .returning();
    return newPayment;
  }

  async updatePayment(
    id: string,
    updateData: Partial<Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Payment | undefined> {
    const [updatedPayment] = await db
      .update(paymentsTable)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(paymentsTable.id, id))
      .returning();
    return updatedPayment;
  }

  // Check payment status for a specific CV
  async checkPaymentStatus(cvId: string, userId: string): Promise<{ status: string; hasPayment: boolean; paymentUrl?: string }> {
    const payments = await db
      .select()
      .from(paymentsTable)
      .where(
        and(
          eq(paymentsTable.cvId, cvId),
          eq(paymentsTable.userId, userId)
        )
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
