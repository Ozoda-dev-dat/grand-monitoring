// Database schema for PDP University Monitoring Platform
// References Replit Auth integration and PostgreSQL database integration

import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const roleEnum = pgEnum("role", [
  "academic_affairs",
  "student_affairs", 
  "teacher",
  "student",
  "grant_committee"
]);

export const gradeEnum = pgEnum("grade", ["excellent", "good", "pass", "retake"]);
export const grantTypeEnum = pgEnum("grant_type", ["golden_minds", "unicorn"]);
export const grantStatusEnum = pgEnum("grant_status", ["pending", "approved", "rejected"]);
export const assignmentStatusEnum = pgEnum("assignment_status", ["pending", "in_progress", "submitted", "reviewed"]);
export const yearEnum = pgEnum("year", ["1", "2", "3", "4"]);
export const directionEnum = pgEnum("direction", ["frontend", "backend", "mobile", "ai_ml", "devops"]);

// Session storage table - REQUIRED for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with username/password authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").notNull().unique(),
  password: varchar("password").notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: roleEnum("role").notNull().default("student"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Students table
export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  studentId: varchar("student_id").notNull().unique(), // University student ID
  year: yearEnum("year").notNull(),
  direction: directionEnum("direction").notNull(),
  gpa: decimal("gpa", { precision: 3, scale: 2 }),
  attendancePercentage: decimal("attendance_percentage", { precision: 5, scale: 2 }).default("0"),
  totalCodingHours: decimal("total_coding_hours", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Teachers table
export const teachers = pgTable("teachers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  department: varchar("department"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subjects table
export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  code: varchar("code").notNull().unique(),
  year: yearEnum("year").notNull(),
  credits: integer("credits").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Student-Subject enrollments
export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  subjectId: varchar("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
  academicYear: varchar("academic_year").notNull(), // e.g., "2024-25"
  createdAt: timestamp("created_at").defaultNow(),
});

// Teacher-Subject assignments
export const teacherAssignments = pgTable("teacher_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teacherId: varchar("teacher_id").notNull().references(() => teachers.id, { onDelete: "cascade" }),
  subjectId: varchar("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
  academicYear: varchar("academic_year").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Grades table
export const grades = pgTable("grades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  enrollmentId: varchar("enrollment_id").notNull().references(() => enrollments.id, { onDelete: "cascade" }),
  grade: gradeEnum("grade").notNull(),
  enteredBy: varchar("entered_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attendance records
export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  enrollmentId: varchar("enrollment_id").notNull().references(() => enrollments.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  present: boolean("present").notNull().default(false),
  enteredBy: varchar("entered_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Grant applications
export const grantApplications = pgTable("grant_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  grantType: grantTypeEnum("grant_type").notNull(),
  academicYear: varchar("academic_year").notNull(),
  status: grantStatusEnum("status").notNull().default("pending"),
  eligibilityPercentage: decimal("eligibility_percentage", { precision: 5, scale: 2 }).default("0"),
  motivationalLetter: text("motivational_letter"),
  internshipDocument: text("internship_document"), // URL or path to document
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assignments
export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  direction: directionEnum("direction").notNull(),
  year: yearEnum("year").notNull(),
  orderIndex: integer("order_index").notNull(), // For progression tracking
  dueDate: timestamp("due_date"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Code submissions
export const codeSubmissions = pgTable("code_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assignmentId: varchar("assignment_id").notNull().references(() => assignments.id, { onDelete: "cascade" }),
  studentId: varchar("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  status: assignmentStatusEnum("status").notNull().default("submitted"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  feedback: text("feedback"),
  grade: gradeEnum("grade"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Coding sessions for time tracking
export const codingSessions = pgTable("coding_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  assignmentId: varchar("assignment_id").references(() => assignments.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  durationMinutes: decimal("duration_minutes", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Teacher comments/evaluations
export const teacherComments = pgTable("teacher_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  teacherId: varchar("teacher_id").notNull().references(() => teachers.id),
  comment: text("comment").notNull(),
  rating: integer("rating"), // 1-5 scale for activity/behavior
  academicYear: varchar("academic_year").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
  teacher: one(teachers, {
    fields: [users.id],
    references: [teachers.userId],
  }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  enrollments: many(enrollments),
  grantApplications: many(grantApplications),
  codeSubmissions: many(codeSubmissions),
  codingSessions: many(codingSessions),
  teacherComments: many(teacherComments),
}));

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.id],
  }),
  assignments: many(teacherAssignments),
  comments: many(teacherComments),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  enrollments: many(enrollments),
  teacherAssignments: many(teacherAssignments),
}));

export const enrollmentsRelations = relations(enrollments, ({ one, many }) => ({
  student: one(students, {
    fields: [enrollments.studentId],
    references: [students.id],
  }),
  subject: one(subjects, {
    fields: [enrollments.subjectId],
    references: [subjects.id],
  }),
  grades: many(grades),
  attendance: many(attendance),
}));

export const assignmentsRelations = relations(assignments, ({ many }) => ({
  submissions: many(codeSubmissions),
  codingSessions: many(codingSessions),
}));

// Zod schemas and types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertStudentSchema = createInsertSchema(students).omit({ id: true, createdAt: true });
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

export const insertTeacherSchema = createInsertSchema(teachers).omit({ id: true, createdAt: true });
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Teacher = typeof teachers.$inferSelect;

export const insertSubjectSchema = createInsertSchema(subjects).omit({ id: true, createdAt: true });
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true, createdAt: true });
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

export const insertTeacherAssignmentSchema = createInsertSchema(teacherAssignments).omit({ id: true, createdAt: true });
export type InsertTeacherAssignment = z.infer<typeof insertTeacherAssignmentSchema>;
export type TeacherAssignment = typeof teacherAssignments.$inferSelect;

export const insertGradeSchema = createInsertSchema(grades).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type Grade = typeof grades.$inferSelect;

export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true, createdAt: true });
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendance.$inferSelect;

export const insertGrantApplicationSchema = createInsertSchema(grantApplications).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGrantApplication = z.infer<typeof insertGrantApplicationSchema>;
export type GrantApplication = typeof grantApplications.$inferSelect;

export const insertAssignmentSchema = createInsertSchema(assignments).omit({ id: true, createdAt: true });
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Assignment = typeof assignments.$inferSelect;

export const insertCodeSubmissionSchema = createInsertSchema(codeSubmissions).omit({ id: true, createdAt: true });
export type InsertCodeSubmission = z.infer<typeof insertCodeSubmissionSchema>;
export type CodeSubmission = typeof codeSubmissions.$inferSelect;

export const insertCodingSessionSchema = createInsertSchema(codingSessions).omit({ id: true, createdAt: true });
export type InsertCodingSession = z.infer<typeof insertCodingSessionSchema>;
export type CodingSession = typeof codingSessions.$inferSelect;

export const insertTeacherCommentSchema = createInsertSchema(teacherComments).omit({ id: true, createdAt: true });
export type InsertTeacherComment = z.infer<typeof insertTeacherCommentSchema>;
export type TeacherComment = typeof teacherComments.$inferSelect;

export const createUserWithStudentSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
  email: z.string().email().optional(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  studentId: z.string().min(1).max(50),
  year: yearEnum.enumValues[0] ? z.enum(yearEnum.enumValues as [string, ...string[]]) : z.string(),
  direction: directionEnum.enumValues[0] ? z.enum(directionEnum.enumValues as [string, ...string[]]) : z.string(),
  gpa: z.string().optional(),
});

export const createUserWithTeacherSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
  email: z.string().email().optional(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  department: z.string().max(100).optional(),
});
