import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema (base from existing schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// CV Schema
export const cvs = pgTable("cvs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  templateId: text("template_id").notNull(),
  data: json("data").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Zod Schemas for CV Data Validation

export const workExperienceSchema = z.object({
  id: z.string().optional(),
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).optional(),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).optional(),
  gpa: z.string().optional(),
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Skill name is required"),
  level: z.number().min(1).max(5).optional(),
  category: z.string().optional(),
});

export const languageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Language name is required"),
  proficiency: z.enum(["Basic", "Intermediate", "Fluent", "Native"]),
  certification: z.string().optional(),
});

export const referenceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Reference name is required"),
  position: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  relationship: z.string().optional(),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  url: z.string().url("Invalid URL").optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  skills: z.array(z.string()).optional(),
});

export const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().optional(),
  date: z.string().optional(),
  expiryDate: z.string().optional(),
  url: z.string().url("Invalid URL").optional(),
});

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().optional(),
  jobTitle: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.string().length(0)),
  linkedin: z.string().url("Invalid URL").optional().or(z.string().length(0)),
  profilePicture: z.string().optional(),
});

export const cvDataSchema = z.object({
  personalInfo: personalInfoSchema,
  workExperience: z.array(workExperienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  skills: z.array(skillSchema).optional(),
  languages: z.array(languageSchema).optional(),
  references: z.array(referenceSchema).optional(),
  projects: z.array(projectSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  summary: z.string().optional(),
  hobbies: z.string().optional(),
});

export const insertCVSchema = createInsertSchema(cvs);

export type InsertCV = z.infer<typeof insertCVSchema>;
export type CV = typeof cvs.$inferSelect;
export type CVData = z.infer<typeof cvDataSchema>;
export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Language = z.infer<typeof languageSchema>;
export type Reference = z.infer<typeof referenceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
