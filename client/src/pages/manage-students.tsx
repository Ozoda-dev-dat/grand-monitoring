import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManageStudents() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Students</h1>
        <p className="text-muted-foreground">Student records and enrollment</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Student management interface</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
