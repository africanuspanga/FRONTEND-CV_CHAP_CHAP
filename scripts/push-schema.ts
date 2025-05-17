import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";
import * as schema from "../shared/schema";

// Required for Neon serverless
neonConfig.webSocketConstructor = ws;

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  console.log('Connecting to database...');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('Creating tables if they do not exist...');
  
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(100) UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        phone_number VARCHAR(20) UNIQUE,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        reset_token VARCHAR(255),
        reset_token_expires TIMESTAMP,
        last_login TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    // Create templates table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS templates (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        description VARCHAR(512),
        html_content TEXT NOT NULL,
        css_content TEXT NOT NULL,
        preview_image VARCHAR(256),
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    // Create cvs table with foreign keys
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cvs (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(36) REFERENCES users(id),
        template_id VARCHAR(64) REFERENCES templates(id),
        cv_data TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    // Create payment status enum if it doesn't exist
    await pool.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
              CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
          END IF;
      END$$;
    `);
    
    // Create payments table with foreign keys
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL REFERENCES users(id),
        cv_id VARCHAR(36) REFERENCES cvs(id),
        status payment_status NOT NULL DEFAULT 'pending',
        amount VARCHAR(10) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'TZS',
        payment_method VARCHAR(20),
        transaction_id VARCHAR(100),
        payment_date TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    console.log('Tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Error running migration:', err);
  process.exit(1);
});