interface GradientCoverProps {
  gradient: string;
  aspectRatio: number;
  title?: string;
  className?: string;
  variant?: "standard" | "large";
}

export function GradientCover({ gradient, aspectRatio, title, className, variant = "standard" }: GradientCoverProps) {
  const ratio = variant === "large" ? 1.8 : variant === "standard" ? 1.2 : aspectRatio;
  const paddingBottom = `${(1 / ratio) * 100}%`;

  return (
    <div className={`relative overflow-hidden ${className || ""}`}>
      <div style={{ paddingBottom, background: gradient }} className="w-full">
        {title && (
          <div className="absolute inset-0 flex items-end p-3">
            <span className="text-xs font-bold text-white/90 drop-shadow-lg line-clamp-2">
              {title}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
