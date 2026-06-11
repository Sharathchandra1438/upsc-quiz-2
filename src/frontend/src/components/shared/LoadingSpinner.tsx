import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
  label,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <Loader2
        className={cn("animate-spin text-accent", sizeClasses[size])}
        aria-hidden="true"
      />
      {label && (
        <p className="text-sm text-muted-foreground animate-pulse">{label}</p>
      )}
    </div>
  );
}

export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="xl" label={label} />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glassmorphic rounded-xl p-5 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted/60" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted/60 rounded w-2/3" />
          <div className="h-3 bg-muted/40 rounded w-1/2" />
        </div>
        <div className="w-16 h-6 bg-muted/60 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted/40 rounded w-full" />
        <div className="h-3 bg-muted/40 rounded w-3/4" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 bg-muted/60 rounded flex-1" />
        <div className="h-8 bg-muted/60 rounded flex-1" />
      </div>
    </div>
  );
}
