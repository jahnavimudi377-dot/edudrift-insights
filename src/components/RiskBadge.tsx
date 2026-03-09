import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const riskBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      level: {
        Stable: "bg-risk-stable/15 text-risk-stable",
        Moderate: "bg-risk-moderate/15 text-risk-moderate",
        High: "bg-risk-high/15 text-risk-high",
      },
    },
  }
);

interface RiskBadgeProps extends VariantProps<typeof riskBadgeVariants> {
  level: "Stable" | "Moderate" | "High";
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  return (
    <span className={cn(riskBadgeVariants({ level }), className)}>
      <span className={cn(
        "mr-1.5 h-1.5 w-1.5 rounded-full",
        level === "Stable" && "bg-risk-stable",
        level === "Moderate" && "bg-risk-moderate",
        level === "High" && "bg-risk-high",
      )} />
      {level === "Stable" ? "Low Risk" : level === "Moderate" ? "Medium Risk" : "High Risk"}
    </span>
  );
}
