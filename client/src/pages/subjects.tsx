import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Subjects() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
        <p className="text-muted-foreground">Course management</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Subject management interface</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
