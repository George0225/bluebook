import { cn } from "@/lib/utils";

interface TagBadgeProps {
  label: string;
  color?: string;
  className?: string;
}

export function TagBadge({ label, color, className }: TagBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-badge px-2 py-0.5 text-[10px] font-medium",
        className
      )}
      style={color ? { backgroundColor: `${color}20`, color } : undefined}
    >
      {label}
    </span>
  );
}
