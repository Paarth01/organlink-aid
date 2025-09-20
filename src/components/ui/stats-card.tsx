import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "success" | "warning" | "emergency";
  className?: string;
}

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = "default",
  className 
}: StatsCardProps) => {
  const variantStyles = {
    default: "border-border",
    success: "border-success/20 bg-success-light/10",
    warning: "border-warning/20 bg-warning-light/10", 
    emergency: "border-emergency/20 bg-emergency/5"
  };

  const iconStyles = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    emergency: "text-emergency"
  };

  return (
    <Card className={cn(
      "medical-transition hover:shadow-lg",
      variantStyles[variant],
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className={cn(
                "text-xs font-medium",
                trend.value > 0 ? "text-success" : "text-muted-foreground"
              )}>
                {trend.value > 0 ? "+" : ""}{trend.value}% {trend.label}
              </p>
            )}
          </div>
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-lg",
            variant === "default" && "bg-primary/10",
            variant === "success" && "bg-success/10",
            variant === "warning" && "bg-warning/10",
            variant === "emergency" && "bg-emergency/10"
          )}>
            <Icon className={cn("h-6 w-6", iconStyles[variant])} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;