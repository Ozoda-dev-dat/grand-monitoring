import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { StatCard } from "@/components/stat-card";
import { GrantEligibilityCard } from "@/components/grant-eligibility-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, TrendingUp, Calendar, Code } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: studentData, isLoading: studentLoading } = useQuery({
    queryKey: ["/api/students/me"],
  });

  const { data: grantData, isLoading: grantLoading } = useQuery({
    queryKey: ["/api/grants/eligibility"],
  });

  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["/api/assignments/upcoming"],
  });

  if (studentLoading || grantLoading) {
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

  const student = studentData || {};
  const grants = grantData || { goldenMinds: null, unicorn: null };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.firstName}! Track your academic progress and grant eligibility.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current GPA"
          value={student.gpa || "N/A"}
          icon={TrendingUp}
          description="Academic performance"
        />
        <StatCard
          title="Attendance"
          value={`${student.attendancePercentage || 0}%`}
          icon={Calendar}
          description="This semester"
        />
        <StatCard
          title="Coding Hours"
          value={Math.round(student.totalCodingHours || 0)}
          icon={Clock}
          description="Total practice time"
        />
        <StatCard
          title="Active Assignments"
          value={assignments?.length || 0}
          icon={Code}
          description="Pending submissions"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {student.year >= 2 && grants.goldenMinds && (
          <GrantEligibilityCard
            grantType="golden_minds"
            percentage={grants.goldenMinds.percentage}
            criteria={grants.goldenMinds.criteria}
          />
        )}
        {student.year >= 1 && grants.unicorn && (
          <GrantEligibilityCard
            grantType="unicorn"
            percentage={grants.unicorn.percentage}
            criteria={grants.unicorn.criteria}
          />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {assignmentsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : assignments && assignments.length > 0 ? (
            <div className="space-y-3">
              {assignments.map((assignment: any) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 rounded-md border hover-elevate" data-testid={`card-assignment-${assignment.id}`}>
                  <div className="space-y-1">
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">{assignment.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{assignment.status}</Badge>
                    <p className="text-sm text-muted-foreground">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No upcoming assignments</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
