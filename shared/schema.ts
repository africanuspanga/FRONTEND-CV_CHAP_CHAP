import { pgTable, serial, varchar, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: varchar("username", { length: 100 }).unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  full_name: varchar("full_name", { length: 255 }),
  phone_number: varchar("phone_number", { length: 20 }).unique(),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  reset_token: varchar("reset_token", { length: 255 }),
  reset_token_expires: timestamp("reset_token_expires"),
  last_login: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  cvs: many(cvs),
  payments: many(payments),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  role: true,
  createdAt: true,
  updatedAt: true
});

// Template schema
export const templates = pgTable("templates", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  description: varchar("description", { length: 512 }),
  htmlContent: text("html_content").notNull(),
  cssContent: text("css_content").notNull(),
  previewImage: varchar("preview_image", { length: 256 }),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const templateRelations = relations(templates, ({ many }) => ({
  cvs: many(cvs),
}));

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// CV schema
export const cvs = pgTable("cvs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  templateId: varchar("template_id", { length: 64 }).references(() => templates.id),
  cvData: text("cv_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cvRelations = relations(cvs, ({ one, many }) => ({
  user: one(users, {
    fields: [cvs.userId],
    references: [users.id],
  }),
  template: one(templates, {
    fields: [cvs.templateId],
    references: [templates.id],
  }),
  payments: many(payments),
}));

export const insertCVSchema = createInsertSchema(cvs).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Payment status enum
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

// Payment schema
export const payments = pgTable("payments", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).references(() => users.id).notNull(),
  cvId: varchar("cv_id", { length: 36 }).references(() => cvs.id),
  status: paymentStatusEnum("status").default("pending").notNull(),
  amount: varchar("amount", { length: 10 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("TZS").notNull(),
  paymentMethod: varchar("payment_method", { length: 20 }),
  transactionId: varchar("transaction_id", { length: 100 }),
  paymentDate: timestamp("payment_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  cv: one(cvs, {
    fields: [payments.cvId],
    references: [cvs.id],
  }),
}));

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Zod schemas for CV data structure
export const workExperienceSchema = z.object({
  id: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).optional(),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  graduationMonth: z.string().optional(),
  graduationYear: z.string().optional(),
  gpa: z.string().optional(),
  honors: z.string().optional(),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.number().min(1).max(5).optional(),
});

export const languageSchema = z.object({
  id: z.string(),
  name: z.string(),
  proficiency: z.enum(["beginner", "intermediate", "advanced", "fluent", "native"]),
});

export const referenceSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string().optional(),
  position: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  url: z.string().url().optional(),
});

export const personalInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  professionalTitle: z.string().optional(),
  summary: z.string().optional(),
  // Adding location field to support the structure requirements
  location: z.string().optional(),
  // Job title is an alias for professionalTitle used by some templates
  jobTitle: z.string().optional(),
  // Profile picture URL or data URI
  profilePicture: z.string().optional(),
  // Social profile links
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

export const accomplishmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

export const hobbySchema = z.object({
  id: z.string(),
  name: z.string().max(30),
});

export const websiteSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
});

export const cvDataSchema = z.object({
  personalInfo: personalInfoSchema,
  // Support both naming conventions for work experience
  workExperiences: z.array(workExperienceSchema).optional(),
  // Some templates use workExp instead of workExperiences
  workExp: z.array(workExperienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  skills: z.array(skillSchema).optional(),
  languages: z.array(languageSchema).optional(),
  references: z.array(referenceSchema).optional(),
  projects: z.array(projectSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  accomplishments: z.array(accomplishmentSchema).optional(),
  hobbies: z.array(hobbySchema).optional(),
  websites: z.array(websiteSchema).optional(),
  colorScheme: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

export type InsertCV = z.infer<typeof insertCVSchema>;
export type CV = typeof cvs.$inferSelect;

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export type CVData = z.infer<typeof cvDataSchema>;
export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Language = z.infer<typeof languageSchema>;
export type Reference = z.infer<typeof referenceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Accomplishment = z.infer<typeof accomplishmentSchema>;
export type Hobby = z.infer<typeof hobbySchema>;
export type Website = z.infer<typeof websiteSchema>;
