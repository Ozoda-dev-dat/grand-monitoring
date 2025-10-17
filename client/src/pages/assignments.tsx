import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Code } from "lucide-react";

export default function Assignments() {
  const { data: assignments, isLoading } = useQuery({
    queryKey: ["/api/assignments/upcoming"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Assignments</h1>
        <p className="text-muted-foreground">View and manage your coding assignments</p>
      </div>

      <div className="grid gap-4">
        {assignments && assignments.length > 0 ? (
          assignments.map((assignment: any) => (
            <Card key={assignment.id} data-testid={`card-assignment-${assignment.id}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                <Badge variant={assignment.status === 'pending' ? 'secondary' : 'default'}>
                  {assignment.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{assignment.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-muted-foreground">
                    Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No deadline'}
                  </p>
                  <Link href="/code-editor">
                    <a className="text-sm text-primary hover:underline inline-flex items-center">
                      <Code className="mr-1 h-4 w-4" />
                      Start Coding
                    </a>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No assignments available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
