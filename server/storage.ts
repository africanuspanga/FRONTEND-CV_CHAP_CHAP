import { 
  users, 
  type User, 
  type InsertUser, 
  type CV, 
  type CVData
} from "@shared/schema";

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // CV methods
  getCV(id: number): Promise<CV | undefined>;
  getAllCVs(): Promise<CV[]>;
  createCV(cv: Omit<CV, 'id'>): Promise<CV>;
  updateCV(id: number, updateData: Partial<Omit<CV, 'id' | 'userId' | 'createdAt'>>): Promise<CV | undefined>;
  deleteCV(id: number): Promise<boolean>;
  
  // Template methods
  getAllTemplates(): Promise<Template[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cvs: Map<number, CV>;
  private templates: Template[];
  private userCurrentId: number;
  private cvCurrentId: number;

  constructor() {
    this.users = new Map();
    this.cvs = new Map();
    this.userCurrentId = 1;
    this.cvCurrentId = 1;

    // Initialize with template data
    this.templates = [
      {
        id: "moonlightSonata",
        name: "Moonlight Sonata",
        description: "A modern template with a warm orange sidebar and clean layout",
        thumbnail: "/templates/moonlight-sonata-thumbnail.svg"
      },
      {
        id: "tanzanite",
        name: "Tanzanite",
        description: "Professional template with blue accents and structured sections",
        thumbnail: "/templates/tanzanite-thumbnail.svg"
      },
      {
        id: "safariPro",
        name: "Safari Pro",
        description: "Bold design with earthy tones inspired by African landscapes",
        thumbnail: "/templates/safari-pro-thumbnail.svg"
      },
      {
        id: "mwalimuClassic",
        name: "Mwalimu Classic",
        description: "Traditional academic-style template for educational professionals",
        thumbnail: "/templates/mwalimu-classic-thumbnail.svg"
      }
    ];
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // CV methods
  async getCV(id: number): Promise<CV | undefined> {
    return this.cvs.get(id);
  }

  async getAllCVs(): Promise<CV[]> {
    return Array.from(this.cvs.values());
  }

  async createCV(cv: Omit<CV, 'id'>): Promise<CV> {
    const id = this.cvCurrentId++;
    const newCV: CV = { ...cv, id };
    this.cvs.set(id, newCV);
    return newCV;
  }

  async updateCV(
    id: number, 
    updateData: Partial<Omit<CV, 'id' | 'userId' | 'createdAt'>>
  ): Promise<CV | undefined> {
    const existingCV = this.cvs.get(id);
    
    if (!existingCV) {
      return undefined;
    }
    
    const updatedCV: CV = { ...existingCV, ...updateData };
    this.cvs.set(id, updatedCV);
    
    return updatedCV;
  }

  async deleteCV(id: number): Promise<boolean> {
    return this.cvs.delete(id);
  }

  // Template methods
  async getAllTemplates(): Promise<Template[]> {
    return this.templates;
  }
}

export const storage = new MemStorage();
