import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Students() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
        <p className="text-muted-foreground">View and manage your students</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Roster</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No students assigned yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
