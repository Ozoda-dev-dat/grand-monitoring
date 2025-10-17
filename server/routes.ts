// API routes for PDP University Monitoring Platform
import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { db } from "./db";
import { users } from "@shared/schema";
import { 
  insertStudentSchema,
  insertTeacherSchema,
  insertSubjectSchema,
  insertEnrollmentSchema,
  insertTeacherAssignmentSchema,
  insertGradeSchema,
  insertAttendanceSchema,
  insertGrantApplicationSchema,
  insertAssignmentSchema,
  insertCodeSubmissionSchema,
  insertCodingSessionSchema,
  insertTeacherCommentSchema,
  createUserWithStudentSchema,
  createUserWithTeacherSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const { password, ...sanitizedUser } = req.user;
      res.json(sanitizedUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Student routes
  app.get('/api/students/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      res.json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ message: "Failed to fetch student data" });
    }
  });

  app.get('/api/students', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'student_affairs' && user?.role !== 'academic_affairs') {
        return res.status(403).json({ message: "Forbidden" });
      }
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.post('/api/students', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'student_affairs') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const validated = createUserWithStudentSchema.parse(req.body);
      const { username, password, firstName, lastName, email, studentId, year, direction, gpa } = validated;
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [newUser] = await db.insert(users).values({
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName,
        role: 'student',
      }).returning();
      
      const student = await storage.createStudent({
        userId: newUser.id,
        studentId,
        year,
        direction,
        gpa,
      });
      
      const { password: _, ...sanitizedUser } = newUser;
      res.json({ user: sanitizedUser, student });
    } catch (error: any) {
      console.error("Error creating student:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      if (error.code === '23505') {
        return res.status(409).json({ message: "Username or student ID already exists" });
      }
      res.status(500).json({ message: "Failed to create student" });
    }
  });

  // Teacher routes
  app.get('/api/teachers', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'student_affairs' && user?.role !== 'academic_affairs') {
        return res.status(403).json({ message: "Forbidden" });
      }
      const teachers = await storage.getAllTeachers();
      res.json(teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      res.status(500).json({ message: "Failed to fetch teachers" });
    }
  });

  app.post('/api/teachers', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'academic_affairs') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const validated = createUserWithTeacherSchema.parse(req.body);
      const { username, password, firstName, lastName, email, department } = validated;
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [newUser] = await db.insert(users).values({
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName,
        role: 'teacher',
      }).returning();
      
      const teacher = await storage.createTeacher({
        userId: newUser.id,
        department,
      });
      
      const { password: _, ...sanitizedUser } = newUser;
      res.json({ user: sanitizedUser, teacher });
    } catch (error: any) {
      console.error("Error creating teacher:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      if (error.code === '23505') {
        return res.status(409).json({ message: "Username already exists" });
      }
      res.status(500).json({ message: "Failed to create teacher" });
    }
  });

  app.get('/api/teachers/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const teacher = await storage.getTeacherByUserId(userId);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher profile not found" });
      }
      
      res.json({
        totalStudents: 0,
        averageGrade: "N/A",
        pendingReviews: 0,
        activeSubjects: 0,
      });
    } catch (error) {
      console.error("Error fetching teacher stats:", error);
      res.status(500).json({ message: "Failed to fetch teacher stats" });
    }
  });

  // Subject routes
  app.get('/api/subjects', isAuthenticated, async (req: any, res) => {
    try {
      const subjects = await storage.getAllSubjects();
      res.json(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  app.post('/api/subjects', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'academic_affairs') {
        return res.status(403).json({ message: "Forbidden" });
      }
      const validated = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject(validated);
      res.json(subject);
    } catch (error) {
      console.error("Error creating subject:", error);
      res.status(500).json({ message: "Failed to create subject" });
    }
  });

  // Grade routes
  app.post('/api/grades', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'student_affairs' && user?.role !== 'teacher') {
        return res.status(403).json({ message: "Forbidden" });
      }
      const validated = insertGradeSchema.parse({
        ...req.body,
        enteredBy: user.id,
      });
      const grade = await storage.createGrade(validated);
      res.json(grade);
    } catch (error) {
      console.error("Error creating grade:", error);
      res.status(500).json({ message: "Failed to create grade" });
    }
  });

  // Attendance routes
  app.post('/api/attendance', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'student_affairs' && user?.role !== 'teacher') {
        return res.status(403).json({ message: "Forbidden" });
      }
      const validated = insertAttendanceSchema.parse({
        ...req.body,
        enteredBy: user.id,
      });
      const record = await storage.createAttendance(validated);
      res.json(record);
    } catch (error) {
      console.error("Error creating attendance:", error);
      res.status(500).json({ message: "Failed to create attendance record" });
    }
  });

  // Grant eligibility calculation
  app.get('/api/grants/eligibility', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      // Calculate eligibility based on criteria
      const enrolls = await storage.getEnrollmentsByStudent(student.id);
      let retakes = 0;
      let passes = 0;
      
      for (const enroll of enrolls) {
        const gradeRecords = await storage.getGradesByEnrollment(enroll.id);
        for (const grade of gradeRecords) {
          if (grade.grade === 'retake') retakes++;
          if (grade.grade === 'pass') passes++;
        }
      }

      // Golden Minds criteria (2nd/3rd year)
      let goldenMindsPercentage = 0;
      const goldenMindsCriteria = [];
      
      if (student.year === '2' || student.year === '3') {
        const noRetakes = retakes === 0;
        const passCriteria = student.year === '2' ? passes <= 3 : passes === 0;
        const attendance = parseFloat(student.attendancePercentage || '0') >= 80;
        
        goldenMindsCriteria.push(
          { label: "No retakes in 2024-25", met: noRetakes, value: `${retakes} retakes` },
          { label: student.year === '2' ? "Max 3 'Pass' grades" : "No 'Pass' grades", met: passCriteria, value: `${passes} passes` },
          { label: "High attendance (≥80%)", met: attendance, value: `${student.attendancePercentage}%` }
        );
        
        const criteriaCount = goldenMindsCriteria.filter(c => c.met).length;
        goldenMindsPercentage = (criteriaCount / goldenMindsCriteria.length) * 100;
      }

      // Unicorn criteria (1st year+)
      const unicornCriteria = [
        { label: "Max 2 retakes", met: retakes <= 2, value: `${retakes} retakes` },
        { label: "High grades", met: passes <= 5, value: `${passes} passes` },
        { label: "High attendance", met: parseFloat(student.attendancePercentage || '0') >= 75, value: `${student.attendancePercentage}%` },
      ];
      
      const unicornCriteriaCount = unicornCriteria.filter(c => c.met).length;
      const unicornPercentage = (unicornCriteriaCount / unicornCriteria.length) * 100;

      res.json({
        goldenMinds: student.year >= 2 ? {
          percentage: Math.round(goldenMindsPercentage),
          criteria: goldenMindsCriteria,
        } : null,
        unicorn: {
          percentage: Math.round(unicornPercentage),
          criteria: unicornCriteria,
        },
      });
    } catch (error) {
      console.error("Error calculating grant eligibility:", error);
      res.status(500).json({ message: "Failed to calculate grant eligibility" });
    }
  });

  // Grant application routes
  app.get('/api/grants/pending', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'grant_committee') {
        return res.status(403).json({ message: "Forbidden" });
      }
      const applications = await storage.getPendingGrantApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching pending grants:", error);
      res.status(500).json({ message: "Failed to fetch pending grant applications" });
    }
  });

  app.get('/api/grants/committee/stats', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'grant_committee') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const pending = await storage.getPendingGrantApplications();
      
      res.json({
        pendingReviews: pending.length,
        goldenMindsApps: pending.filter(a => a.grantType === 'golden_minds').length,
        unicornApps: pending.filter(a => a.grantType === 'unicorn').length,
        approvedThisYear: 0,
      });
    } catch (error) {
      console.error("Error fetching grant committee stats:", error);
      res.status(500).json({ message: "Failed to fetch grant committee stats" });
    }
  });

  // Assignment routes
  app.get('/api/assignments/current', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      const assignments = await storage.getAssignmentsByDirection(student.direction, student.year);
      const current = assignments.find(a => true); // TODO: implement logic to find current assignment
      res.json(current || null);
    } catch (error) {
      console.error("Error fetching current assignment:", error);
      res.status(500).json({ message: "Failed to fetch current assignment" });
    }
  });

  app.get('/api/assignments/upcoming', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      const assignments = await storage.getAssignmentsByDirection(student.direction, student.year);
      res.json(assignments.slice(0, 5));
    } catch (error) {
      console.error("Error fetching upcoming assignments:", error);
      res.status(500).json({ message: "Failed to fetch upcoming assignments" });
    }
  });

  // Code submission routes
  app.post('/api/submissions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      const { sessionId, ...submissionData } = req.body;
      
      // End coding session
      if (sessionId) {
        const sessions = await storage.getSessionsByStudent(student.id);
        const session = sessions.find(s => s.id === sessionId && !s.endTime);
        if (session) {
          const endTime = new Date();
          const durationMinutes = (endTime.getTime() - new Date(session.startTime).getTime()) / 60000;
          await storage.updateCodingSession(sessionId, {
            endTime,
            durationMinutes: durationMinutes.toString(),
          });
          
          // Update student's total coding hours
          const totalHours = parseFloat(student.totalCodingHours || '0') + (durationMinutes / 60);
          await storage.updateStudent(student.id, {
            totalCodingHours: totalHours.toString(),
          });
        }
      }

      const validated = insertCodeSubmissionSchema.parse({
        ...submissionData,
        studentId: student.id,
      });
      const submission = await storage.createCodeSubmission(validated);
      res.json(submission);
    } catch (error) {
      console.error("Error creating submission:", error);
      res.status(500).json({ message: "Failed to create submission" });
    }
  });

  app.get('/api/submissions/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Student profile not found" });
      }
      
      const submissions = await storage.getSubmissionsByStudent(student.id);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching submission history:", error);
      res.status(500).json({ message: "Failed to fetch submission history" });
    }
  });

  app.get('/api/submissions/recent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const teacher = await storage.getTeacherByUserId(userId);
      if (!teacher) {
        return res.status(403).json({ message: "Teacher access required" });
      }
      
      const submissions = await storage.getRecentSubmissions(teacher.id);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching recent submissions:", error);
      res.status(500).json({ message: "Failed to fetch recent submissions" });
    }
  });

  // Coding session routes
  app.post('/api/coding-sessions/start', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const student = await storage.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      const session = await storage.createCodingSession({
        studentId: student.id,
        assignmentId: req.body.assignmentId,
        startTime: new Date(),
      });
      res.json(session);
    } catch (error) {
      console.error("Error starting coding session:", error);
      res.status(500).json({ message: "Failed to start coding session" });
    }
  });

  // Student Affairs stats
  app.get('/api/student-affairs/stats', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'student_affairs') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const students = await storage.getAllStudents();
      const teachers = await storage.getAllTeachers();
      const subjects = await storage.getAllSubjects();
      
      res.json({
        activeStudents: students.length,
        facultyCount: teachers.length,
        avgAttendance: 85,
        totalSubjects: subjects.length,
      });
    } catch (error) {
      console.error("Error fetching student affairs stats:", error);
      res.status(500).json({ message: "Failed to fetch student affairs stats" });
    }
  });

  app.get('/api/student-affairs/activities', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'student_affairs') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json([]);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Academic Affairs stats
  app.get('/api/academic-affairs/stats', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'academic_affairs') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const students = await storage.getAllStudents();
      const teachers = await storage.getAllTeachers();
      const subjects = await storage.getAllSubjects();
      
      res.json({
        totalEnrollment: students.length,
        activePrograms: 5,
        avgGPA: "3.5",
        facultyRatio: students.length / (teachers.length || 1),
      });
    } catch (error) {
      console.error("Error fetching academic affairs stats:", error);
      res.status(500).json({ message: "Failed to fetch academic affairs stats" });
    }
  });

  app.get('/api/academic-affairs/reports', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'academic_affairs') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json([]);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
