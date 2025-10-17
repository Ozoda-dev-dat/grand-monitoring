import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GrantStats() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Grant Statistics</h1>
        <p className="text-muted-foreground">Grant program analytics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Grant statistics interface</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
