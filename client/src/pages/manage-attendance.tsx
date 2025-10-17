import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManageAttendance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Attendance</h1>
        <p className="text-muted-foreground">Track student attendance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Attendance tracking interface</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
