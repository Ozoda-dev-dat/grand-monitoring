import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, ClipboardCheck, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function TeacherDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/teachers/stats"],
  });

  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ["/api/submissions/recent"],
  });

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  const teacherStats = stats || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}! Manage your students and course materials.
          </p>
        </div>
        <Button asChild data-testid="button-grade-entry">
          <Link href="/grade-entry">
            <BookOpen className="mr-2 h-4 w-4" />
            Grade Entry
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={teacherStats.totalStudents || 0}
          icon={Users}
          description="Enrolled in your courses"
        />
        <StatCard
          title="Average Grade"
          value={teacherStats.averageGrade || "N/A"}
          icon={TrendingUp}
          description="Class performance"
        />
        <StatCard
          title="Pending Reviews"
          value={teacherStats.pendingReviews || 0}
          icon={ClipboardCheck}
          description="Submissions to grade"
        />
        <StatCard
          title="Active Subjects"
          value={teacherStats.activeSubjects || 0}
          icon={BookOpen}
          description="Current semester"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {submissionsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : submissions && submissions.length > 0 ? (
            <div className="space-y-3">
              {submissions.map((submission: any) => (
                <div key={submission.id} className="flex items-center justify-between p-3 rounded-md border hover-elevate" data-testid={`card-submission-${submission.id}`}>
                  <div className="space-y-1">
                    <p className="font-medium">{submission.studentName}</p>
                    <p className="text-sm text-muted-foreground">{submission.assignmentTitle}</p>
                  </div>
                  <Button variant="outline" size="sm" data-testid={`button-review-${submission.id}`}>
                    Review
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No recent submissions</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
