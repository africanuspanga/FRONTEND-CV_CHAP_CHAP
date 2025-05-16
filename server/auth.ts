import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { User, insertUserSchema } from "@shared/schema";
import { z } from "zod";

// Extended User type for our application
interface AppUser extends Omit<User, "password"> {}

declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}

// Use environment variable for JWT secret or a default for development
const JWT_SECRET = process.env.JWT_SECRET || "cv-chap-chap-jwt-secret-key";
const JWT_EXPIRY = "24h"; // Token expires in 24 hours

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Generate JWT token
function generateToken(user: User): string {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000)
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
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
    return res.status(401).json({ 
      success: false, 
      message: "Authentication required", 
      code: "AUTH_REQUIRED" 
    });
  }
  
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      success: false, 
      message: "Invalid token format", 
      code: "INVALID_TOKEN_FORMAT" 
    });
  }
  
  const token = parts[1];
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token", 
      code: "INVALID_TOKEN" 
    });
  }
  
  // Set user in request for route handlers
  (req as any).user = decoded;
  next();
}

// Registration schema with validation
const registerSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone_number: z.string().optional(),
  username: z.string().optional(),
  full_name: z.string().optional()
});

// Login schema with conditional validation for email or phone_number
const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address").optional(),
  phone_number: z.string().optional(),
  password: z.string().min(1, "Password is required")
}).refine(data => data.email || data.phone_number, {
  message: "Either email or phone number must be provided",
  path: ["email"]
});

export function setupAuth(app: Express) {
  // Initialize passport
  app.use(passport.initialize());
  
  // Register a new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Validate input
      const validationResult = registerSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      const { email, password, phone_number, username, full_name } = validationResult.data;
      
      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists",
          code: "EMAIL_EXISTS"
        });
      }
      
      // Check if phone number is unique if provided
      if (phone_number) {
        const existingUserByPhone = await storage.getUserByPhoneNumber(phone_number);
        if (existingUserByPhone) {
          return res.status(409).json({
            success: false,
            message: "User with this phone number already exists",
            code: "PHONE_EXISTS"
          });
        }
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        ...(phone_number && { phone_number }),
        ...(username && { username }),
        ...(full_name && { full_name })
      });
      
      // Generate token
      const token = generateToken(user);
      
      // Update last login time
      await storage.updateUser(user.id, { last_login: new Date() });
      
      // Return user data and token
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred during registration"
      });
    }
  });
  
  // Login a user
  app.post("/api/auth/login", async (req, res) => {
    try {
      // Validate input
      const validationResult = loginSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      const { email, phone_number, password } = validationResult.data;
      
      // Find user by email or phone
      let user: User | undefined;
      
      if (email) {
        user = await storage.getUserByEmail(email);
      } else if (phone_number) {
        user = await storage.getUserByPhoneNumber(phone_number);
      }
      
      // Check if user exists and password is correct
      if (!user || !(await comparePasswords(password, user.password))) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
          code: "AUTH_FAILED"
        });
      }
      
      // Generate token
      const token = generateToken(user);
      
      // Update last login time
      await storage.updateUser(user.id, { last_login: new Date() });
      
      // Return user data and token
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred during login"
      });
    }
  });
  
  // Logout - just a formality for client to clear token
  app.post("/api/auth/logout", (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  });
  
  // Get current user
  app.get("/api/auth/me", authenticateJWT, async (req, res) => {
    try {
      const userId = (req as any).user.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json({
        success: true,
        data: userWithoutPassword
      });
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching user"
      });
    }
  });
  
  // Update user profile
  app.put("/api/auth/update-profile", authenticateJWT, async (req, res) => {
    try {
      const userId = (req as any).user.sub;
      const { username, phone_number, full_name } = req.body;
      
      // Check if user exists
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      
      // Check if phone number is unique if provided
      if (phone_number && phone_number !== existingUser.phone_number) {
        const existingUserByPhone = await storage.getUserByPhoneNumber(phone_number);
        if (existingUserByPhone && existingUserByPhone.id !== userId) {
          return res.status(409).json({
            success: false,
            message: "Phone number is already in use",
            code: "PHONE_EXISTS"
          });
        }
      }
      
      // Check if username is unique if provided
      if (username && username !== existingUser.username) {
        const existingUserByUsername = await storage.getUserByUsername(username);
        if (existingUserByUsername && existingUserByUsername.id !== userId) {
          return res.status(409).json({
            success: false,
            message: "Username is already in use",
            code: "USERNAME_EXISTS"
          });
        }
      }
      
      // Update user
      const updatedUser = await storage.updateUser(userId, {
        ...(username && { username }),
        ...(phone_number && { phone_number }),
        ...(full_name && { full_name })
      });
      
      // Return updated user without password
      const { password, ...userWithoutPassword } = updatedUser;
      
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: userWithoutPassword
      });
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating profile"
      });
    }
  });
  
  // Forgot password
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required"
        });
      }
      
      // Find user
      const user = await storage.getUserByEmail(email);
      
      // Do not reveal if user exists or not
      if (!user) {
        return res.status(200).json({
          success: true,
          message: "Password reset instructions sent to your email"
        });
      }
      
      // Generate reset token
      const resetToken = randomBytes(32).toString("hex");
      const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour
      
      // Save token to user
      await storage.updateUser(user.id, {
        reset_token: resetToken,
        reset_token_expires: resetTokenExpires
      });
      
      // In a real application, send email with reset link
      // For now, just respond with success
      
      return res.status(200).json({
        success: true,
        message: "Password reset instructions sent to your email"
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // Reset password
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({
          success: false,
          message: "Token and password are required"
        });
      }
      
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
          errors: [{
            field: "password",
            message: "Password must be at least 6 characters"
          }]
        });
      }
      
      // Find user by reset token
      const user = await storage.getUserByResetToken(token);
      
      if (!user || !user.reset_token_expires || user.reset_token_expires < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired token"
        });
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(password);
      
      // Update user
      await storage.updateUser(user.id, {
        password: hashedPassword,
        reset_token: null,
        reset_token_expires: null
      });
      
      return res.status(200).json({
        success: true,
        message: "Password has been reset successfully"
      });
    } catch (error) {
      console.error("Reset password error:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while resetting password"
      });
    }
  });
}