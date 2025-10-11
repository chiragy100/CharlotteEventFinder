import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConfidenceBadgeProps {
  score: number;
  verificationStatus: string;
  className?: string;
  showLabel?: boolean;
}

export function ConfidenceBadge({
  score,
  verificationStatus,
  className = "",
  showLabel = true,
}: ConfidenceBadgeProps) {
  const getVariant = () => {
    if (verificationStatus === "verified" || score >= 80) {
      return "success";
    }
    if (verificationStatus === "flagged" || score < 50) {
      return "destructive";
    }
    return "warning";
  };

  const getIcon = () => {
    if (verificationStatus === "verified" || score >= 80) {
      return <CheckCircle2 className="h-3 w-3" />;
    }
    if (verificationStatus === "flagged" || score < 50) {
      return <XCircle className="h-3 w-3" />;
    }
    return <AlertCircle className="h-3 w-3" />;
  };

  const getLabel = () => {
    if (verificationStatus === "verified") return "Verified";
    if (verificationStatus === "flagged") return "Flagged";
    return "Unverified";
  };

  const getTooltipContent = () => {
    if (verificationStatus === "verified") {
      return `Confidence: ${score}% - This event has been verified through credible sources.`;
    }
    if (verificationStatus === "flagged") {
      return `Confidence: ${score}% - This event has been flagged for review.`;
    }
    return `Confidence: ${score}% - This event is pending verification.`;
  };

  const variant = getVariant();
  const badgeClass = variant === "success" 
    ? "bg-success text-success-foreground hover:bg-success/90"
    : variant === "warning"
    ? "bg-warning text-warning-foreground hover:bg-warning/90"
    : "";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex">
          <Badge
            variant={variant === "destructive" ? "destructive" : "default"}
            className={`${badgeClass} gap-1 font-mono text-xs ${className}`}
            data-testid={`badge-confidence-${verificationStatus}`}
          >
            {getIcon()}
            {showLabel && <span>{getLabel()}</span>}
            <span className="font-semibold">{score}</span>
          </Badge>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">{getTooltipContent()}</p>
      </TooltipContent>
    </Tooltip>
  );
}
