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

const ringSize = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-14 w-14",
  xl: "h-22 w-22",
};

export function GradientAvatar({ color, initial, size = "md", className }: GradientAvatarProps) {
  return (
    <div className={cn("relative flex-shrink-0 group", className)}>
      {/* Rotating ring on hover */}
      <div
        className={cn(
          "absolute inset-[-2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          ringSize[size]
        )}
        style={{
          background: `conic-gradient(from 0deg, ${color.includes("gradient") ? "#E8782A" : color.split(",")[0]?.replace(/.*#/, "#") || "#E8782A"}, #7B68EE, #5B9BD5, ${color.includes("gradient") ? "#E8782A" : color.split(",")[0]?.replace(/.*#/, "#") || "#E8782A"})`,
          animation: "ring-rotate 2s linear infinite",
          WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #fff calc(100% - 2px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #fff calc(100% - 2px))",
        }}
      />
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-bold text-white relative z-10",
          sizeMap[size]
        )}
        style={{ background: color }}
      >
        {initial}
      </div>
    </div>
  );
}
