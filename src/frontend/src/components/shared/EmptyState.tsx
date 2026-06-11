import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  "data-ocid"?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  "data-ocid": dataOcid,
}: EmptyStateProps) {
  return (
    <div
      data-ocid={dataOcid}
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-6 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl glassmorphic flex items-center justify-center mb-2">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold font-display text-foreground">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          variant="outline"
          className="mt-2 border-accent/40 text-accent hover:bg-accent/10"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
