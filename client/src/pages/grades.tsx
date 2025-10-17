import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Grades() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Grades</h1>
        <p className="text-muted-foreground">View your academic performance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No grades available yet</p>
            <p className="text-sm text-muted-foreground mt-2">Grades will appear here once entered by faculty</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
