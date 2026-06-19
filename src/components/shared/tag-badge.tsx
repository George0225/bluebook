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
        "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm transition-all duration-200 hover:scale-105",
        className
      )}
      style={color ? {
        backgroundColor: `${color}15`,
        color,
        border: `1px solid ${color}25`,
        boxShadow: `0 0 8px ${color}10`,
      } : {
        backgroundColor: "rgba(232,233,237,0.05)",
        color: "#9DA2B3",
        border: "1px solid rgba(232,233,237,0.08)",
      }}
    >
      {label}
    </span>
  );
}
