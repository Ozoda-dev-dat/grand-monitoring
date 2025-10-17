// Storage layer with PostgreSQL database integration
import {
  users,
  students,
  teachers,
  subjects,
  enrollments,
  teacherAssignments,
  grades,
  attendance,
  grantApplications,
  assignments,
  codeSubmissions,
  codingSessions,
  teacherComments,
  type User,
  type UpsertUser,
  type Student,
  type InsertStudent,
  type Teacher,
  type InsertTeacher,
  type Subject,
  type InsertSubject,
  type Enrollment,
  type InsertEnrollment,
  type TeacherAssignment,
  type InsertTeacherAssignment,
  type Grade,
  type InsertGrade,
  type Attendance,
  type InsertAttendance,
  type GrantApplication,
  type InsertGrantApplication,
  type Assignment,
  type InsertAssignment,
  type CodeSubmission,
  type InsertCodeSubmission,
  type CodingSession,
  type InsertCodingSession,
  type TeacherComment,
  type InsertTeacherComment,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (REQUIRED for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Student operations
  getStudent(id: string): Promise<Student | undefined>;
  getStudentByUserId(userId: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, data: Partial<InsertStudent>): Promise<Student>;
  getAllStudents(): Promise<Student[]>;
  
  // Teacher operations
  getTeacher(id: string): Promise<Teacher | undefined>;
  getTeacherByUserId(userId: string): Promise<Teacher | undefined>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  getAllTeachers(): Promise<Teacher[]>;
  
  // Subject operations
  getSubject(id: string): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  getAllSubjects(): Promise<Subject[]>;
  
  // Enrollment operations
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]>;
  
  // Teacher assignment operations
  createTeacherAssignment(assignment: InsertTeacherAssignment): Promise<TeacherAssignment>;
  getTeacherAssignments(teacherId: string): Promise<TeacherAssignment[]>;
  
  // Grade operations
  createGrade(grade: InsertGrade): Promise<Grade>;
  getGradesByEnrollment(enrollmentId: string): Promise<Grade[]>;
  
  // Attendance operations
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  getAttendanceByEnrollment(enrollmentId: string): Promise<Attendance[]>;
  
  // Grant application operations
  createGrantApplication(application: InsertGrantApplication): Promise<GrantApplication>;
  getGrantApplicationsByStudent(studentId: string): Promise<GrantApplication[]>;
  getPendingGrantApplications(): Promise<GrantApplication[]>;
  updateGrantApplication(id: string, data: Partial<InsertGrantApplication>): Promise<GrantApplication>;
  
  // Assignment operations
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  getAssignmentsByDirection(direction: string, year: string): Promise<Assignment[]>;
  
  // Code submission operations
  createCodeSubmission(submission: InsertCodeSubmission): Promise<CodeSubmission>;
  getSubmissionsByStudent(studentId: string): Promise<CodeSubmission[]>;
  getRecentSubmissions(teacherId?: string): Promise<CodeSubmission[]>;
  
  // Coding session operations
  createCodingSession(session: InsertCodingSession): Promise<CodingSession>;
  updateCodingSession(id: string, data: Partial<InsertCodingSession>): Promise<CodingSession>;
  getSessionsByStudent(studentId: string): Promise<CodingSession[]>;
  
  // Teacher comment operations
  createTeacherComment(comment: InsertTeacherComment): Promise<TeacherComment>;
  getCommentsByStudent(studentId: string): Promise<TeacherComment[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (REQUIRED for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Student operations
  async getStudent(id: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }

  async getStudentByUserId(userId: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.userId, userId));
    return student;
  }

  async createStudent(studentData: InsertStudent): Promise<Student> {
    const [student] = await db.insert(students).values(studentData).returning();
    return student;
  }

  async updateStudent(id: string, data: Partial<InsertStudent>): Promise<Student> {
    const [student] = await db
      .update(students)
      .set(data)
      .where(eq(students.id, id))
      .returning();
    return student;
  }

  async getAllStudents(): Promise<Student[]> {
    return await db.select().from(students);
  }

  // Teacher operations
  async getTeacher(id: string): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.id, id));
    return teacher;
  }

  async getTeacherByUserId(userId: string): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.userId, userId));
    return teacher;
  }

  async createTeacher(teacherData: InsertTeacher): Promise<Teacher> {
    const [teacher] = await db.insert(teachers).values(teacherData).returning();
    return teacher;
  }

  async getAllTeachers(): Promise<Teacher[]> {
    return await db.select().from(teachers);
  }

  // Subject operations
  async getSubject(id: string): Promise<Subject | undefined> {
    const [subject] = await db.select().from(subjects).where(eq(subjects.id, id));
    return subject;
  }

  async createSubject(subjectData: InsertSubject): Promise<Subject> {
    const [subject] = await db.insert(subjects).values(subjectData).returning();
    return subject;
  }

  async getAllSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects);
  }

  // Enrollment operations
  async createEnrollment(enrollmentData: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db.insert(enrollments).values(enrollmentData).returning();
    return enrollment;
  }

  async getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.studentId, studentId));
  }

  // Teacher assignment operations
  async createTeacherAssignment(assignmentData: InsertTeacherAssignment): Promise<TeacherAssignment> {
    const [assignment] = await db.insert(teacherAssignments).values(assignmentData).returning();
    return assignment;
  }

  async getTeacherAssignments(teacherId: string): Promise<TeacherAssignment[]> {
    return await db.select().from(teacherAssignments).where(eq(teacherAssignments.teacherId, teacherId));
  }

  // Grade operations
  async createGrade(gradeData: InsertGrade): Promise<Grade> {
    const [grade] = await db.insert(grades).values(gradeData).returning();
    return grade;
  }

  async getGradesByEnrollment(enrollmentId: string): Promise<Grade[]> {
    return await db.select().from(grades).where(eq(grades.enrollmentId, enrollmentId));
  }

  // Attendance operations
  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const [record] = await db.insert(attendance).values(attendanceData).returning();
    return record;
  }

  async getAttendanceByEnrollment(enrollmentId: string): Promise<Attendance[]> {
    return await db.select().from(attendance).where(eq(attendance.enrollmentId, enrollmentId));
  }

  // Grant application operations
  async createGrantApplication(applicationData: InsertGrantApplication): Promise<GrantApplication> {
    const [application] = await db.insert(grantApplications).values(applicationData).returning();
    return application;
  }

  async getGrantApplicationsByStudent(studentId: string): Promise<GrantApplication[]> {
    return await db.select().from(grantApplications).where(eq(grantApplications.studentId, studentId));
  }

  async getPendingGrantApplications(): Promise<GrantApplication[]> {
    return await db.select().from(grantApplications).where(eq(grantApplications.status, "pending"));
  }

  async updateGrantApplication(id: string, data: Partial<InsertGrantApplication>): Promise<GrantApplication> {
    const [application] = await db
      .update(grantApplications)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(grantApplications.id, id))
      .returning();
    return application;
  }

  // Assignment operations
  async createAssignment(assignmentData: InsertAssignment): Promise<Assignment> {
    const [assignment] = await db.insert(assignments).values(assignmentData).returning();
    return assignment;
  }

  async getAssignmentsByDirection(direction: string, year: string): Promise<Assignment[]> {
    return await db
      .select()
      .from(assignments)
      .where(and(eq(assignments.direction, direction as any), eq(assignments.year, year as any)));
  }

  // Code submission operations
  async createCodeSubmission(submissionData: InsertCodeSubmission): Promise<CodeSubmission> {
    const [submission] = await db.insert(codeSubmissions).values(submissionData).returning();
    return submission;
  }

  async getSubmissionsByStudent(studentId: string): Promise<CodeSubmission[]> {
    return await db
      .select()
      .from(codeSubmissions)
      .where(eq(codeSubmissions.studentId, studentId))
      .orderBy(desc(codeSubmissions.submittedAt));
  }

  async getRecentSubmissions(teacherId?: string): Promise<CodeSubmission[]> {
    return await db
      .select()
      .from(codeSubmissions)
      .orderBy(desc(codeSubmissions.submittedAt))
      .limit(10);
  }

  // Coding session operations
  async createCodingSession(sessionData: InsertCodingSession): Promise<CodingSession> {
    const [session] = await db.insert(codingSessions).values(sessionData).returning();
    return session;
  }

  async updateCodingSession(id: string, data: Partial<InsertCodingSession>): Promise<CodingSession> {
    const [session] = await db
      .update(codingSessions)
      .set(data)
      .where(eq(codingSessions.id, id))
      .returning();
    return session;
  }

  async getSessionsByStudent(studentId: string): Promise<CodingSession[]> {
    return await db.select().from(codingSessions).where(eq(codingSessions.studentId, studentId));
  }

  // Teacher comment operations
  async createTeacherComment(commentData: InsertTeacherComment): Promise<TeacherComment> {
    const [comment] = await db.insert(teacherComments).values(commentData).returning();
    return comment;
  }

  async getCommentsByStudent(studentId: string): Promise<TeacherComment[]> {
    return await db.select().from(teacherComments).where(eq(teacherComments.studentId, studentId));
  }
}

export const storage = new DatabaseStorage();
