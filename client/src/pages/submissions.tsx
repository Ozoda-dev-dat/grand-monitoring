import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Submissions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
        <p className="text-muted-foreground">Review student code submissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No submissions to review</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
