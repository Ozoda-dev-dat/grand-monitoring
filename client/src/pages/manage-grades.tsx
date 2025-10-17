import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManageGrades() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Grades</h1>
        <p className="text-muted-foreground">Enter and update student grades</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Grade management interface</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
