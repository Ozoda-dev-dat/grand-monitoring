// Main App component with Replit Auth integration
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import StudentDashboard from "@/pages/student-dashboard";
import TeacherDashboard from "@/pages/teacher-dashboard";
import StudentAffairsDashboard from "@/pages/student-affairs-dashboard";
import AcademicAffairsDashboard from "@/pages/academic-affairs-dashboard";
import GrantCommitteeDashboard from "@/pages/grant-committee-dashboard";
import CodeEditor from "@/pages/code-editor";
import Assignments from "@/pages/assignments";
import Grades from "@/pages/grades";
import Grants from "@/pages/grants";
import Students from "@/pages/students";
import GradeEntry from "@/pages/grade-entry";
import Submissions from "@/pages/submissions";
import ManageStudents from "@/pages/manage-students";
import ManageGrades from "@/pages/manage-grades";
import ManageAttendance from "@/pages/manage-attendance";
import ManageFaculty from "@/pages/manage-faculty";
import AcademicOverview from "@/pages/academic-overview";
import Subjects from "@/pages/subjects";
import Reports from "@/pages/reports";
import GrantApplications from "@/pages/grant-applications";
import GrantReview from "@/pages/grant-review";
import GrantStats from "@/pages/grant-stats";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Role-based dashboard routing
  const getDashboardComponent = () => {
    switch (user?.role) {
      case "student":
        return StudentDashboard;
      case "teacher":
        return TeacherDashboard;
      case "student_affairs":
        return StudentAffairsDashboard;
      case "academic_affairs":
        return AcademicAffairsDashboard;
      case "grant_committee":
        return GrantCommitteeDashboard;
      default:
        return StudentDashboard;
    }
  };

  return (
    <Switch>
      <Route path="/" component={getDashboardComponent()} />
      <Route path="/code-editor" component={CodeEditor} />
      <Route path="/assignments" component={Assignments} />
      <Route path="/grades" component={Grades} />
      <Route path="/grants" component={Grants} />
      <Route path="/students" component={Students} />
      <Route path="/grade-entry" component={GradeEntry} />
      <Route path="/submissions" component={Submissions} />
      <Route path="/manage-students" component={ManageStudents} />
      <Route path="/manage-grades" component={ManageGrades} />
      <Route path="/manage-attendance" component={ManageAttendance} />
      <Route path="/manage-faculty" component={ManageFaculty} />
      <Route path="/academic-overview" component={AcademicOverview} />
      <Route path="/subjects" component={Subjects} />
      <Route path="/reports" component={Reports} />
      <Route path="/grant-applications" component={GrantApplications} />
      <Route path="/grant-review" component={GrantReview} />
      <Route path="/grant-stats" component={GrantStats} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="pdp-ui-theme">
        <TooltipProvider>
          <SidebarProvider style={style}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between gap-2 border-b px-4 py-2">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <UserNav />
                  </div>
                </header>
                <main className="flex-1 overflow-auto p-6">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
