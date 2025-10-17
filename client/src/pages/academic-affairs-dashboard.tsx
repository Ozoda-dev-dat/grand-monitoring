import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, BookOpen, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function AcademicAffairsDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/academic-affairs/stats"],
  });

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/academic-affairs/reports"],
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

  const academicStats = stats || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Affairs Dashboard</h1>
        <p className="text-muted-foreground">
          Oversee academic operations and monitor institutional performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Enrollment"
          value={academicStats.totalEnrollment || 0}
          icon={Users}
          description="All students"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Active Programs"
          value={academicStats.activePrograms || 0}
          icon={BookOpen}
          description="Current semester"
        />
        <StatCard
          title="Avg. GPA"
          value={academicStats.avgGPA || "N/A"}
          icon={TrendingUp}
          description="Institution-wide"
        />
        <StatCard
          title="Faculty-Student Ratio"
          value={`1:${academicStats.facultyRatio || 0}`}
          icon={BarChart3}
          description="Teaching effectiveness"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Button asChild size="lg" data-testid="button-view-subjects">
          <Link href="/subjects">
            <BookOpen className="mr-2 h-5 w-5" />
            View Subjects
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" data-testid="button-generate-reports">
          <Link href="/reports">
            <BarChart3 className="mr-2 h-5 w-5" />
            Generate Reports
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" data-testid="button-academic-overview">
          <Link href="/academic-overview">
            <TrendingUp className="mr-2 h-5 w-5" />
            Performance Overview
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {reportsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : reports && reports.length > 0 ? (
            <div className="space-y-2">
              {reports.map((report: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-md border" data-testid={`report-${index}`}>
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No reports available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
