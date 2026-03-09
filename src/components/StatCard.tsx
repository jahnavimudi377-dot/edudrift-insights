import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const statCardVariants = cva(
  "rounded-lg border p-5 transition-all duration-200 hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-card border-border",
        primary: "bg-primary/5 border-primary/20",
        risk: "bg-destructive/5 border-destructive/20",
        success: "bg-risk-stable/10 border-risk-stable/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface StatCardProps extends VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, variant, className }: StatCardProps) {
  return (
    <div className={cn(statCardVariants({ variant }), className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-bold font-display tracking-tight text-foreground">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {icon && (
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
