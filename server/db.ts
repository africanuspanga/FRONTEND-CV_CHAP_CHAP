import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure neon to use websockets
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create database connection pool
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// Function to initialize the database
export async function initializeDatabase() {
  console.log("Initializing database connection...");
  try {
    // Test connection by fetching users count
    const result = await db.select().from(schema.users);
    console.log(`Database connected successfully. Found ${result.length} users.`);
    return true;
  } catch (error) {
    console.error("Database initialization error:", error);
    return false;
  }
}