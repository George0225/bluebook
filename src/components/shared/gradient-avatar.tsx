import { cn } from "@/lib/utils";

interface GradientAvatarProps {
  color: string;
  initial: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-12 w-12 text-base",
  xl: "h-20 w-20 text-2xl",
};

export function GradientAvatar({ color, initial, size = "md", className }: GradientAvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white shadow-sm",
        sizeMap[size],
        className
      )}
      style={{ background: color }}
    >
      {initial}
    </div>
  );
}
