import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GradeEntry() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Grade Entry</h1>
        <p className="text-muted-foreground">Enter and manage student grades</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade Entry Form</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Select a student and subject to enter grades</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
