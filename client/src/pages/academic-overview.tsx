import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AcademicOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Overview</h1>
        <p className="text-muted-foreground">System-wide academic performance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Academic performance overview</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
