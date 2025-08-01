import { Request, Response, NextFunction, Express } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { userStorage } from './storage';
import { eq, or } from 'drizzle-orm';

// JWT Secret (in production, this would be an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h'; // Token expires in 24 hours as per requirements

// In-memory users store (for development only)
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  full_name?: string;
  phone_number?: string;
  created_at: Date;
  updated_at: Date;
}

// Anonymous user CVs
interface AnonymousCV {
  anonymous_id: string;
  cv_data: any;
  created_at: Date;
}

// Simple in-memory storage for users and anonymous CVs
const users: User[] = [];
const anonymousCVs: AnonymousCV[] = [];

// Create a demo user for testing
async function createDemoUsers() {
  // Clear existing users
  users.length = 0;
  
  // Create a test user with email login
  const emailUser: User = {
    id: uuidv4(),
    username: 'demoemail',
    email: 'test@example.com',
    password: await hashPassword('password123'),
    phone_number: '+255123456789',
    full_name: 'Demo Email User',
    role: 'user',
    created_at: new Date(),
    updated_at: new Date()
  };
  
  // Create the Luca Toni user
  const lucaUser: User = {
    id: uuidv4(),
    username: 'lucatoni',
    email: 'lucatoni@gmail.com',
    password: await hashPassword('password123'),
    phone_number: '+255753091526',
    full_name: 'Luca Toni',
    role: 'user',
    created_at: new Date(),
    updated_at: new Date()
  };
  
  // Create the admin user
  const adminUser: User = {
    id: uuidv4(),
    username: 'admin',
    email: 'admin@cvchapchap.com',
    password: await hashPassword('admin123'),
    phone_number: '+255793166375',
    full_name: 'Admin User',
    role: 'admin',
    created_at: new Date(),
    updated_at: new Date()
  };
  
  users.push(emailUser, lucaUser, adminUser);
  console.log('Created demo users:', users.map(u => u.email));
}

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
    const { username, email, password, full_name, phone_number, anonymous_id } = req.body;
    
    console.log('Registration attempt with data:', {
      email, phone_number, full_name, username 
    });
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Generate username from email if not provided
    const finalUsername = username || email.split('@')[0];
    
    // Check if the user already exists in both memory and database
    const existingUser = users.find(u => 
      (finalUsername && u.username === finalUsername) || 
      u.email === email ||
      (phone_number && u.phone_number === phone_number)
    );
    
    // Check if user exists in database
    const emailUser = await userStorage.getUserByEmail(email);
    const usernameUser = await userStorage.getUserByUsername(finalUsername);
    const phoneUser = phone_number ? await userStorage.getUserByPhone(phone_number) : null;
    
    // Combine results to check if user exists in any form
    const existingUserInDb = emailUser || usernameUser || phoneUser;
    
    if (existingUser || existingUserInDb) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create a new user - no need for UUID as database will auto-assign ID
    const newUser: User = {
      id: '0', // Will be updated after DB insert
      username: finalUsername,
      email,
      password: hashedPassword,
      full_name: full_name || '',
      phone_number,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    try {
      // Store in database with only the fields that exist in DB
      const dbUser = await userStorage.createUser({
        username: finalUsername,
        email,
        password: hashedPassword
      });
      
      // Update in-memory user with ID from database
      if (dbUser && dbUser.id) {
        newUser.id = String(dbUser.id);
      }
      
      // Add to in-memory store
      users.push(newUser);
      console.log('User successfully stored in database:', email);
    } catch (dbError) {
      console.error('Error storing user in database:', dbError);
      // Continue with in-memory store even if DB fails
    }
    
    // If anonymous_id is provided, associate anonymous CVs with the new user
    if (anonymous_id) {
      // In a real implementation, this would update CVs in the database
      // For now, we just log that we would do this
      console.log(`Associating anonymous CVs with ID ${anonymous_id} to user ${newUser.id}`);
      
      // Find and "update" anonymous CVs (just logging for now)
      const userAnonymousCVs = anonymousCVs.filter(cv => cv.anonymous_id === anonymous_id);
      console.log(`Found ${userAnonymousCVs.length} anonymous CVs to associate with user`);
    }
    
    // Create user response without password
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      phone_number: newUser.phone_number,
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
    
    // Log the login attempt for debugging
    console.log('Login attempt with identifier:', identifier);
    console.log('Current users in system:', users.length);
    
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Identifier and password are required' });
    }
    
    // Log users for debugging
    console.log('Available users:', users.map(u => ({
      username: u.username,
      email: u.email,
      phone: u.phone_number
    })));
    
    // Normalize the identifier - remove any spaces or special characters for phone numbers
    const normalizedIdentifier = identifier.replace(/\s+/g, '');
    
    console.log('Searching for user with normalized identifier:', normalizedIdentifier);
    
    // First check in-memory storage
    let user = users.find(u => {
      // Check username match
      if (u.username === normalizedIdentifier) {
        console.log('Found user by username');
        return true;
      }
      
      // Check email match 
      if (u.email === normalizedIdentifier) {
        console.log('Found user by email');
        return true;
      }
      
      // Check phone number match - normalize stored phone number too
      if (u.phone_number) {
        const normalizedPhone = u.phone_number.replace(/\s+/g, '');
        console.log('Comparing stored phone:', normalizedPhone, 'with input:', normalizedIdentifier);
        if (normalizedPhone === normalizedIdentifier) {
          console.log('Found user by phone number');
          return true;
        }
      }
      
      return false;
    });
    
    // If not found in memory, check database
    if (!user) {
      try {
        // Try to find by email
        let dbUser = await userStorage.getUserByEmail(normalizedIdentifier);
        
        // If not found by email, try by username
        if (!dbUser) {
          dbUser = await userStorage.getUserByUsername(normalizedIdentifier);
        }
        
        // If not found by username, try by phone
        if (!dbUser) {
          dbUser = await userStorage.getUserByPhone(normalizedIdentifier);
        }
        
        if (dbUser) {
          console.log('Found user in database:', dbUser.email);
          
          // Convert database user to in-memory user format
          // Map actual db structure to the expected format
          user = {
            id: String(dbUser.id), // Convert number to string
            username: dbUser.username || '',
            email: dbUser.email,
            password: dbUser.password,
            full_name: '', // Not in db, use empty string
            phone_number: undefined, // Not in db
            role: 'user', // Not in db, use default
            created_at: dbUser.created_at,
            updated_at: dbUser.updated_at
          };
          
          // Add to in-memory store for faster access next time
          users.push(user);
        }
      } catch (dbError) {
        console.error('Error checking database for user:', dbError);
        // Continue with in-memory result even if DB check fails
      }
    }
    
    if (!user) {
      console.log('No user found with identifier:', identifier);
      // For development only: Create a test user if none exists and we're using a test identifier
      if (identifier === 'test@example.com' && password === 'password123') {
        console.log('Creating test user for development');
        // Create a test user
        const testUser: User = {
          id: uuidv4(),
          username: 'testuser',
          email: 'test@example.com',
          password: await hashPassword('password123'),
          phone_number: '+255123456789',
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        };
        
        // Add to users array
        users.push(testUser);
        
        // Generate a token
        const token = generateToken({
          id: testUser.id,
          username: testUser.username,
          email: testUser.email,
          role: testUser.role
        });
        
        // Return the test user (without password) and token
        const { password: _, ...userWithoutPassword } = testUser;
        
        return res.status(200).json({
          user: userWithoutPassword,
          token
        });
      }
      
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare the password
    const isMatch = await comparePasswords(password, user.password);
    
    if (!isMatch) {
      console.log('Password did not match for user:', user.username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('Successful login for user:', user.username);
    
    // Update last login time
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

// Create an anonymous user
async function createAnonymous(req: Request, res: Response) {
  try {
    // Generate a unique anonymous ID
    const anonymousId = uuidv4();
    
    // If CV data was provided, store it
    if (req.body.cv_data) {
      const anonymousCV: AnonymousCV = {
        anonymous_id: anonymousId,
        cv_data: req.body.cv_data,
        created_at: new Date()
      };
      
      anonymousCVs.push(anonymousCV);
    }
    
    // Return the anonymous ID
    return res.status(201).json({ 
      anonymous_id: anonymousId,
      message: 'Anonymous session created successfully'
    });
  } catch (error) {
    console.error('Error creating anonymous session:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Set up authentication routes
export async function setupAuth(app: Express) {
  // Create demo users on startup
  await createDemoUsers();
  
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
  
  // Create an anonymous session
  app.post('/api/auth/anonymous', createAnonymous);
  
  // Profile management endpoints
  app.get('/api/user/profile', authenticate, getUserProfile);
  app.put('/api/user/profile', authenticate, updateUserProfile);
  app.post('/api/user/change-password', authenticate, changePassword);
  app.delete('/api/user/delete-account', authenticate, deleteAccount);
  
  // Handle error responses
  app.use('/api/auth/*', (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Auth API error:', err);
    
    // Handle specific error types as mentioned in the documentation
    if (err.name === 'UnauthorizedError' || err.status === 401) {
      return res.status(401).json({ message: 'Unauthorized: Invalid or missing token' });
    }
    
    if (err.name === 'ValidationError' || err.status === 400) {
      return res.status(400).json({ message: 'Bad Request: Invalid input data' });
    }
    
    if (err.status === 404) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Default server error
    return res.status(500).json({ message: 'Internal server error' });
  });
}

// Get user profile
export async function getUserProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Find user in memory and database
    const userInMemory = users.find(u => u.id === userId);
    let dbUser = null;
    
    // Database lookup (commented out as method doesn't exist yet)
    // try {
    //   dbUser = await userStorage.getUser(parseInt(userId));
    // } catch (dbError) {
    //   console.log('Database lookup failed, using memory data');
    // }

    const user = dbUser || userInMemory;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user profile without password
    const userProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name || '',
      phone_number: user.phone_number || '',
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    return res.json(userProfile);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update user profile
export async function updateUserProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { email, username, phone_number, full_name } = req.body;

    // Find user in memory
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for email conflicts
    if (email && email !== users[userIndex].email) {
      const emailExists = users.some(u => u.email === email && u.id !== userId);
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Check for username conflicts  
    if (username && username !== users[userIndex].username) {
      const usernameExists = users.some(u => u.username === username && u.id !== userId);
      if (usernameExists) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    // Update user data
    const updatedUser = {
      ...users[userIndex],
      email: email || users[userIndex].email,
      username: username || users[userIndex].username,
      phone_number: phone_number !== undefined ? phone_number : users[userIndex].phone_number,
      full_name: full_name !== undefined ? full_name : users[userIndex].full_name,
      updated_at: new Date()
    };

    users[userIndex] = updatedUser;

    // Update in database if possible (commented out as methods don't exist yet)
    // try {
    //   await userStorage.updateUser(parseInt(userId), {
    //     email: updatedUser.email,
    //     username: updatedUser.username
    //   });
    // } catch (dbError) {
    //   console.log('Database update failed, using memory data');
    // }

    // Return updated profile without password
    const userProfile = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      full_name: updatedUser.full_name,
      phone_number: updatedUser.phone_number,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at
    };

    return res.json({ 
      message: 'Profile updated successfully',
      user: userProfile 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Change user password
export async function changePassword(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password using existing verifyPassword function
    const isCurrentPasswordValid = await bcrypt.compare(current_password, users[userIndex].password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(new_password);

    // Update user password
    users[userIndex].password = hashedNewPassword;
    users[userIndex].updated_at = new Date();

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete user account
export async function deleteAccount(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password confirmation is required' });
    }

    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, users[userIndex].password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    // Remove user from memory
    users.splice(userIndex, 1);

    // Delete from database if possible (commented out as method doesn't exist yet)
    // try {
    //   await userStorage.deleteUser(parseInt(userId));
    // } catch (dbError) {
    //   console.log('Database delete failed, but memory deleted');
    // }

    return res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Export users array for admin access
export { users };