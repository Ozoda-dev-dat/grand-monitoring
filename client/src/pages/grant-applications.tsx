import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GrantApplications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Grant Applications</h1>
        <p className="text-muted-foreground">Review grant applications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Grant applications interface</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
