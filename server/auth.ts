import { Request, Response, NextFunction, Express } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { User, InsertUser } from "@shared/schema";

// Set up JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "cv-chap-chap-secret-key";
const JWT_EXPIRES_IN = "7d";

// Create schema for registration
const registerSchema = z.object({
  username: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().optional(),
  phone_number: z.string().optional(),
});

// Create schema for login
const loginSchema = z.object({
  identifier: z.string().min(3, "Email or phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Create schema for password reset request
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Create schema for password reset
const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Hash password
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Compare password with hash
async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Generate JWT token
function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verify JWT token
function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Authentication middleware
function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // Add user to request
  (req as any).user = decoded;
  next();
}

// Setup auth routes
export function setupAuth(app: Express) {
  // Register new user
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = registerSchema.parse(req.body);
      
      // Check if email already exists
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      // Check if phone number already exists (if provided)
      if (validatedData.phone_number) {
        const existingUserByPhone = await storage.getUserByPhoneNumber(validatedData.phone_number);
        if (existingUserByPhone) {
          return res.status(400).json({ message: "Phone number already in use" });
        }
      }
      
      // Hash password
      const hashedPassword = await hashPassword(validatedData.password);
      
      // Create user
      const newUser = await storage.createUser({
        ...validatedData,
        password: hashedPassword
        // role is set to "user" by default in the storage implementation
      });
      
      // Update last login time
      await storage.updateUser(newUser.id, {
        last_login: new Date()
      });
      
      // Generate JWT token
      const token = generateToken(newUser);
      
      // Return user data (excluding password) and token
      const { password, ...userData } = newUser;
      
      res.status(201).json({
        user: userData,
        token
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  
  // Login user
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = loginSchema.parse(req.body);
      
      // Find user by email or phone
      let user = await storage.getUserByEmail(validatedData.identifier);
      
      // If not found by email, try phone number
      if (!user) {
        user = await storage.getUserByPhoneNumber(validatedData.identifier);
      }
      
      // Check if user exists
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const isPasswordValid = await comparePasswords(
        validatedData.password,
        user.password
      );
      
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Update last login time
      await storage.updateUser(user.id, {
        last_login: new Date()
      });
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Return user data (excluding password) and token
      const { password, ...userData } = user;
      
      res.status(200).json({
        user: userData,
        token
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  
  // Get current user
  app.get("/api/auth/me", authenticateJWT, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      
      // Get user from database (to get updated info)
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user data (excluding password)
      const { password, ...userData } = user;
      
      res.status(200).json({ user: userData });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  
  // Logout user (client-side, just for completeness)
  app.post("/api/auth/logout", (_req: Request, res: Response) => {
    res.status(200).json({ message: "Logged out successfully" });
  });
  
  // Forgot password - send reset token
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      
      // For security reasons, always return success even if email doesn't exist
      if (!user) {
        return res.status(200).json({ 
          message: "If your email is registered, you will receive a password reset link" 
        });
      }
      
      // Generate reset token (random UUID)
      const resetToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
      const resetTokenExpires = new Date();
      resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Token expires in 1 hour
      
      // Update user with reset token
      await storage.updateUser(user.id, {
        reset_token: resetToken,
        reset_token_expires: resetTokenExpires
      });
      
      // In a real app, you would send an email with the reset link
      // For this implementation, we'll just return the token directly (for testing)
      
      res.status(200).json({ 
        message: "If your email is registered, you will receive a password reset link",
        // Include this in development only:
        resetToken 
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  
  // Reset password
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);
      
      // Find user by reset token
      const user = await storage.getUserByResetToken(token);
      
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      
      // Check if token is expired
      if (user.reset_token_expires && user.reset_token_expires < new Date()) {
        return res.status(400).json({ message: "Reset token has expired" });
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(password);
      
      // Update user with new password and remove reset token
      await storage.updateUser(user.id, {
        password: hashedPassword,
        reset_token: null,
        reset_token_expires: null
      });
      
      res.status(200).json({ message: "Password reset successful" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
}