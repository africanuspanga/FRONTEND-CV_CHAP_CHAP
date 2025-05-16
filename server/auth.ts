import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import type { User } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends User {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'cv-chap-chap-secret-key',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({
      usernameField: 'email', // Using email as the username field
    }, async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Register a new user
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const { email, password, full_name, phone_number, username } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      
      const hashedPassword = await hashPassword(password);
      
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        ...(full_name && { full_name }),
        ...(phone_number && { phone_number }),
        ...(username && { username }),
      });
      
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        res.status(201).json({ 
          user: userWithoutPassword,
          token: generateToken(user) // You might want to implement a JWT token generation function
        });
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  });

  // Login a user
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: 'Invalid email or password' });
      
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json({ 
          user: userWithoutPassword,
          token: generateToken(user) // You might want to implement a JWT token generation function
        });
      });
    })(req, res, next);
  });

  // Logout a user
  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Get the current user
  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: 'Not authenticated' });
    
    // Return user without password
    const { password, ...userWithoutPassword } = req.user as User;
    res.json(userWithoutPassword);
  });
}

// Simple token generation - in a real app, use JWT
function generateToken(user: User): string {
  const data = `${user.id}:${user.email}:${Date.now()}`;
  return Buffer.from(data).toString('base64');
}