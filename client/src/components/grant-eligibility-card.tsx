import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface GrantEligibilityCriteria {
  label: string;
  met: boolean;
  value?: string;
}

interface GrantEligibilityCardProps {
  grantType: "golden_minds" | "unicorn";
  percentage: number;
  criteria: GrantEligibilityCriteria[];
}

export function GrantEligibilityCard({ grantType, percentage, criteria }: GrantEligibilityCardProps) {
  const getStatus = () => {
    if (percentage >= 80) return { label: "Eligible", variant: "default" as const, color: "text-green-600 dark:text-green-400" };
    if (percentage >= 50) return { label: "At Risk", variant: "secondary" as const, color: "text-yellow-600 dark:text-yellow-400" };
    return { label: "Ineligible", variant: "destructive" as const, color: "text-red-600 dark:text-red-400" };
  };

  const status = getStatus();
  const title = grantType === "golden_minds" ? "Golden Minds Grant" : "Unicorn Grant";

  return (
    <Card data-testid={`card-grant-${grantType}`}>
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <Badge variant={status.variant} data-testid={`badge-grant-status-${grantType}`}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Eligibility</span>
            <span className={`text-2xl font-bold ${status.color}`} data-testid={`text-grant-percentage-${grantType}`}>
              {percentage}%
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Criteria Checklist</p>
          <div className="space-y-1">
            {criteria.map((criterion, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                {criterion.met ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={criterion.met ? "text-foreground" : "text-muted-foreground"}>
                    {criterion.label}
                  </p>
                  {criterion.value && (
                    <p className="text-xs text-muted-foreground">{criterion.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
