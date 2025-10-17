import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";

export default function GrantCommitteeDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/grants/committee/stats"],
  });

  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/grants/pending"],
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

  const grantStats = stats || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Grant Committee Dashboard</h1>
        <p className="text-muted-foreground">
          Review and approve grant applications for Golden Minds and Unicorn programs.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Reviews"
          value={grantStats.pendingReviews || 0}
          icon={Clock}
          description="Awaiting decision"
        />
        <StatCard
          title="Golden Minds"
          value={grantStats.goldenMindsApps || 0}
          icon={Award}
          description="Total applications"
        />
        <StatCard
          title="Unicorn Grant"
          value={grantStats.unicornApps || 0}
          icon={Award}
          description="Total applications"
        />
        <StatCard
          title="Approved This Year"
          value={grantStats.approvedThisYear || 0}
          icon={CheckCircle}
          description="2024-25 academic year"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Button asChild size="lg" data-testid="button-review-queue">
          <Link href="/grant-review">
            <Clock className="mr-2 h-5 w-5" />
            Review Queue
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" data-testid="button-grant-stats">
          <Link href="/grant-stats">
            <Award className="mr-2 h-5 w-5" />
            View Statistics
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {applicationsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          ) : applications && applications.length > 0 ? (
            <div className="space-y-3">
              {applications.map((app: any) => (
                <div key={app.id} className="flex items-center justify-between p-4 rounded-md border hover-elevate" data-testid={`card-application-${app.id}`}>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{app.studentName}</p>
                      <Badge variant={app.grantType === 'golden_minds' ? 'default' : 'secondary'}>
                        {app.grantType === 'golden_minds' ? 'Golden Minds' : 'Unicorn'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Year {app.year} • Eligibility: {app.eligibilityPercentage}%</p>
                  </div>
                  <Button variant="outline" size="sm" data-testid={`button-review-${app.id}`}>
                    Review
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No pending applications</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
