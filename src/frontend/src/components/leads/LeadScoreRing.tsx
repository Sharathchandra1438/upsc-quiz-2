import { cn } from "@/lib/utils";

interface LeadScoreRingProps {
  score: number;
  size?: number;
  className?: string;
}

export function LeadScoreRing({
  score,
  size = 44,
  className,
}: LeadScoreRingProps) {
  const tier = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colors = {
    high: { stroke: "#34d399", text: "text-emerald-400" },
    medium: { stroke: "#fbbf24", text: "text-amber-400" },
    low: { stroke: "#fb7185", text: "text-rose-400" },
  }[tier];

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          className="text-border/40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={3}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <span
        className={cn("absolute text-[10px] font-bold font-mono", colors.text)}
      >
        {score}
      </span>
    </div>
  );
}
