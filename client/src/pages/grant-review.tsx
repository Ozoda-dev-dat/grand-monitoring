import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GrantReview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Grant Review Queue</h1>
        <p className="text-muted-foreground">Review pending grant applications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Grant review interface</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
