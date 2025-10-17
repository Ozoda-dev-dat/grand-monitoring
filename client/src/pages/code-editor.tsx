import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Editor } from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Clock, Save, Send, Code } from "lucide-react";

export default function CodeEditor() {
  const { toast } = useToast();
  const [code, setCode] = useState<string>("// Start coding here...\n");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: currentAssignment, isLoading: assignmentLoading } = useQuery({
    queryKey: ["/api/assignments/current"],
  });

  const { data: previousSubmissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ["/api/submissions/history"],
  });

  // Start coding session
  const startSessionMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      return await apiRequest("POST", "/api/coding-sessions/start", { assignmentId });
    },
    onSuccess: (data) => {
      setSessionId(data.id);
      setSessionStart(new Date());
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to start coding session",
        variant: "destructive",
      });
    },
  });

  // Submit code
  const submitMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/submissions", {
        assignmentId: currentAssignment?.id,
        code,
        sessionId,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Code submitted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/submissions/history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/assignments/current"] });
      setCode("// Start coding here...\n");
      if (timerRef.current) clearInterval(timerRef.current);
      setSessionId(null);
      setSessionStart(null);
      setElapsedTime(0);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit code",
        variant: "destructive",
      });
    },
  });

  // Timer effect
  useEffect(() => {
    if (sessionStart && !timerRef.current) {
      timerRef.current = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - sessionStart.getTime()) / 1000);
        setElapsedTime(diff);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [sessionStart]);

  // Auto-start session when assignment is loaded
  useEffect(() => {
    if (currentAssignment && !sessionId) {
      startSessionMutation.mutate(currentAssignment.id);
    }
  }, [currentAssignment]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (assignmentLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!currentAssignment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Code className="h-16 w-16 text-muted-foreground mx-auto" />
          <p className="text-xl font-medium">No active assignment</p>
          <p className="text-muted-foreground">Check back later for new assignments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-assignment-title">{currentAssignment.title}</h1>
          <p className="text-muted-foreground">{currentAssignment.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span className="font-mono font-medium" data-testid="text-timer">{formatTime(elapsedTime)}</span>
          </div>
          <Badge>JavaScript</Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base">Code Editor</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({ title: "Auto-save enabled" });
                  }}
                  data-testid="button-save"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  size="sm"
                  onClick={() => submitMutation.mutate()}
                  disabled={submitMutation.isPending || !code.trim()}
                  data-testid="button-submit"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {submitMutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Editor
                height="500px"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {currentAssignment.requirements || "Complete the assignment requirements and submit your code."}
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Due Date</p>
                <p className="text-sm font-medium">
                  {currentAssignment.dueDate ? new Date(currentAssignment.dueDate).toLocaleDateString() : "No deadline"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Previous Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {submissionsLoading ? (
                <Skeleton className="h-20" />
              ) : previousSubmissions && previousSubmissions.length > 0 ? (
                <div className="space-y-2">
                  {previousSubmissions.slice(0, 3).map((sub: any) => (
                    <div key={sub.id} className="p-2 rounded border text-xs" data-testid={`submission-${sub.id}`}>
                      <p className="font-medium">{new Date(sub.submittedAt).toLocaleString()}</p>
                      <p className="text-muted-foreground">Status: {sub.status}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No previous submissions</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
