import { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: "border-border",
  primary: "border-primary/30 glow-primary",
  success: "border-success/30 glow-success",
  warning: "border-warning/30",
  danger: "border-destructive/30",
};

const iconBgStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
};

export function KPICard({ title, value, subtitle, icon, trend, trendValue, variant = "default" }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-card rounded-lg p-5 border ${variantStyles[variant]} transition-all hover:scale-[1.02]`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</span>
        <div className={`p-2 rounded-md ${iconBgStyles[variant]}`}>{icon}</div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold tracking-tight text-foreground font-mono">{value}</span>
        {trend && trendValue && (
          <span className={`flex items-center gap-0.5 text-xs font-medium mb-1 ${trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"}`}>
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : trend === "down" ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {trendValue}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </motion.div>
  );
}
