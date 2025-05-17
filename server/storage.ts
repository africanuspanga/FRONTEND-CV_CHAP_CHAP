import { db } from './db';
import { users as usersTable } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Define an interface for our user storage
export interface UserStorage {
  createUser(userData: {
    id: string;
    username: string;
    email: string;
    password: string;
    full_name?: string;
    phone_number?: string;
    role?: string;
  }): Promise<any>;
  
  getUserById(id: string): Promise<any | null>;
  getUserByEmail(email: string): Promise<any | null>;
  getUserByUsername(username: string): Promise<any | null>;
  getUserByPhone(phone: string): Promise<any | null>;
}

// Database implementation of UserStorage
export class DatabaseUserStorage implements UserStorage {
  async createUser(userData: {
    id: string;
    username: string;
    email: string;
    password: string;
    full_name?: string;
    phone_number?: string;
    role?: string;
  }) {
    try {
      const result = await db.insert(usersTable).values({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name || null,
        phone_number: userData.phone_number || null,
        role: userData.role || 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      return result[0];
    } catch (error) {
      console.error('Database error creating user:', error);
      throw error;
    }
  }
  
  async getUserById(id: string) {
    try {
      const results = await db.select().from(usersTable).where(eq(usersTable.id, id));
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Database error getting user by ID:', error);
      return null;
    }
  }
  
  async getUserByEmail(email: string) {
    try {
      const results = await db.select().from(usersTable).where(eq(usersTable.email, email));
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Database error getting user by email:', error);
      return null;
    }
  }
  
  async getUserByUsername(username: string) {
    try {
      const results = await db.select().from(usersTable).where(eq(usersTable.username, username));
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Database error getting user by username:', error);
      return null;
    }
  }
  
  async getUserByPhone(phone: string) {
    try {
      const results = await db.select().from(usersTable).where(eq(usersTable.phone_number, phone));
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Database error getting user by phone:', error);
      return null;
    }
  }
}

// Create an instance of DatabaseUserStorage to use throughout the app
export const userStorage = new DatabaseUserStorage();