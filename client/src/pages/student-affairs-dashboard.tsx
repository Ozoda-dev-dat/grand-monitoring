import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, UserCog, BarChart3 } from "lucide-react";
import { Link } from "wouter";

export default function StudentAffairsDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/student-affairs/stats"],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/student-affairs/activities"],
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

  const affairsStats = stats || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Affairs Dashboard</h1>
        <p className="text-muted-foreground">
          Manage student records, grades, and faculty assignments.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Students"
          value={affairsStats.activeStudents || 0}
          icon={Users}
          description="Currently enrolled"
        />
        <StatCard
          title="Faculty Members"
          value={affairsStats.facultyCount || 0}
          icon={UserCog}
          description="Teaching staff"
        />
        <StatCard
          title="Avg. Attendance"
          value={`${affairsStats.avgAttendance || 0}%`}
          icon={BarChart3}
          description="All students"
        />
        <StatCard
          title="Subjects"
          value={affairsStats.totalSubjects || 0}
          icon={BookOpen}
          description="Active courses"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Button asChild size="lg" data-testid="button-manage-students">
          <Link href="/manage-students">
            <Users className="mr-2 h-5 w-5" />
            Manage Students
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" data-testid="button-manage-grades">
          <Link href="/manage-grades">
            <BookOpen className="mr-2 h-5 w-5" />
            Enter Grades
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" data-testid="button-manage-faculty">
          <Link href="/manage-faculty">
            <UserCog className="mr-2 h-5 w-5" />
            Assign Faculty
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : activities && activities.length > 0 ? (
            <div className="space-y-2">
              {activities.map((activity: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-md border" data-testid={`activity-${index}`}>
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No recent activities</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
