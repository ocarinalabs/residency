"use client";

import { cn } from "@/lib/utils";

type BGPatternProps = {
  variant?: "grid" | "dots";
  mask?: "fade-edges" | "none";
  size?: number;
  fill?: string;
  className?: string;
};

export function BGPattern({
  variant = "grid",
  mask = "fade-edges",
  size = 40,
  fill = "rgba(128, 128, 128, 0.1)",
  className,
}: BGPatternProps) {
  const patternId = `pattern-${variant}`;

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
      height="100%"
      role="presentation"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {variant === "grid" && (
          <pattern
            height={size}
            id={patternId}
            patternUnits="userSpaceOnUse"
            width={size}
          >
            <path
              d={`M ${size} 0 L 0 0 0 ${size}`}
              fill="none"
              stroke={fill}
              strokeWidth="1"
            />
          </pattern>
        )}
        {variant === "dots" && (
          <pattern
            height={size}
            id={patternId}
            patternUnits="userSpaceOnUse"
            width={size}
          >
            <circle cx={size / 2} cy={size / 2} fill={fill} r="1" />
          </pattern>
        )}
        {mask === "fade-edges" && (
          <radialGradient id="fade-mask">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>
        )}
        {mask === "fade-edges" && (
          <mask id="fade">
            <rect fill="url(#fade-mask)" height="100%" width="100%" />
          </mask>
        )}
      </defs>
      <rect
        fill={`url(#${patternId})`}
        height="100%"
        mask={mask === "fade-edges" ? "url(#fade)" : undefined}
        width="100%"
      />
    </svg>
  );
}
