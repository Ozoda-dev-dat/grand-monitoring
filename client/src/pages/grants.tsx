import { useQuery } from "@tanstack/react-query";
import { GrantEligibilityCard } from "@/components/grant-eligibility-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Grants() {
  const { data: studentData, isLoading: studentLoading } = useQuery({
    queryKey: ["/api/students/me"],
  });

  const { data: grantData, isLoading: grantLoading } = useQuery({
    queryKey: ["/api/grants/eligibility"],
  });

  if (studentLoading || grantLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const student = studentData || {};
  const grants = grantData || { goldenMinds: null, unicorn: null };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Grant Status</h1>
        <p className="text-muted-foreground">Track your eligibility for university grants</p>
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
          <CardTitle>Application Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No active grant applications</p>
            <p className="text-sm text-muted-foreground mt-2">Meet the eligibility criteria to apply for grants</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
