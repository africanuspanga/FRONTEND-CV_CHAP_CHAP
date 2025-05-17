import { db } from './db';
import { users as usersTable } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Define an interface for our user storage
export interface UserStorage {
  // Updated to match actual database structure
  createUser(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<any>;
  
  getUserById(id: number): Promise<any | null>;
  getUserByEmail(email: string): Promise<any | null>;
  getUserByUsername(username: string): Promise<any | null>;
  getUserByPhone(phone: string): Promise<any | null>;
}

// Database implementation of UserStorage
export class DatabaseUserStorage implements UserStorage {
  async createUser(userData: {
    username: string;
    email: string;
    password: string;
  }) {
    try {
      // Match the actual database structure - only include fields that exist
      const result = await db.insert(usersTable).values({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        created_at: new Date(),
        updated_at: new Date()
      }).returning();
      
      return result[0];
    } catch (error) {
      console.error('Database error creating user:', error);
      throw error;
    }
  }
  
  async getUserById(id: number) {
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
      // Only use fields that exist in the actual database
      const results = await db.select().from(usersTable).where(eq(usersTable.email, email));
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Database error getting user by email:', error);
      return null;
    }
  }
  
  async getUserByUsername(username: string) {
    try {
      // Only use fields that exist in the actual database
      const results = await db.select().from(usersTable).where(eq(usersTable.username, username));
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Database error getting user by username:', error);
      return null;
    }
  }
  
  async getUserByPhone(phone: string) {
    // Phone number field doesn't exist in the actual database
    // Just return null as we can't query by phone
    return null;
  }
}

// Create an instance of DatabaseUserStorage to use throughout the app
export const userStorage = new DatabaseUserStorage();