import { Request, Response, NextFunction, Express } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// JWT Secret (in production, this would be an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

// In-memory users store (for development only)
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

// Simple in-memory storage for users
const users: User[] = [];

// Define user data for the JWT token payload
interface JwtPayload {
  id: string;
  username: string;
  email: string;
  role: string;
}

// Hash a password
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Compare a password with a hash
async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Generate a JWT token
function generateToken(user: JwtPayload): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Authentication middleware
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Role-based authorization middleware
export function authorize(roles: string[] = ['user']) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    
    next();
  };
}

// Register a new user
export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    
    // Check if the user already exists
    const existingUser = users.find(u => 
      u.username === username || u.email === email
    );
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create a new user
    const newUser: User = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    };

    // Add to in-memory store
    users.push(newUser);
    
    // Create user response without password
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at
    };
    
    // Generate a token
    const token = generateToken({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    });
    
    // Return the user and token
    return res.status(201).json({
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Login a user
export async function login(req: Request, res: Response) {
  try {
    const { identifier, password } = req.body;
    
    // Identifier can be username or email
    const user = users.find(u => 
      u.username === identifier || u.email === identifier
    );
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare the password
    const isMatch = await comparePasswords(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last login time (not actually needed for in-memory)
    user.updated_at = new Date();
    
    // Generate a token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
    
    // Return the user without the password
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get the current user
export async function getMe(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = users.find(u => u.id === req.user?.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return the user without the password
    const { password, ...userWithoutPassword } = user;
    
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Set up authentication routes
export function setupAuth(app: Express) {
  // Extend Express Request interface to include user
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.user = undefined;
    next();
  });
  
  // Register a new user
  app.post('/api/auth/register', register);
  
  // Login a user
  app.post('/api/auth/login', login);
  
  // Logout (client-side only - just clear the token)
  app.post('/api/auth/logout', (req, res) => {
    return res.status(200).json({ message: 'Logged out successfully' });
  });
  
  // Get the current user
  app.get('/api/auth/me', authenticate, getMe);
}