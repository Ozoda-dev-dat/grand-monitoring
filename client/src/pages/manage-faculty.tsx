import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManageFaculty() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Faculty</h1>
        <p className="text-muted-foreground">Faculty assignments and management</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faculty Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Faculty management interface</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
