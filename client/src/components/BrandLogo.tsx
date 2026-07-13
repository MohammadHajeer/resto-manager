import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BrandLogoSize = "sm" | "md" | "lg";
type BrandLogoVariant = "icon" | "wordmark";
type BrandLogoTone = "default" | "inverse";

type BrandLogoProps = {
  size?: BrandLogoSize;
  variant?: BrandLogoVariant;
  tone?: BrandLogoTone;
  subtitle?: ReactNode;
  className?: string;
};

const sizeStyles: Record<
  BrandLogoSize,
  { mark: string; name: string; subtitle: string }
> = {
  sm: {
    mark: "size-8 rounded-lg",
    name: "text-base",
    subtitle: "text-[9px]",
  },
  md: {
    mark: "size-9 rounded-xl",
    name: "text-lg",
    subtitle: "text-[9px]",
  },
  lg: {
    mark: "size-10 rounded-xl",
    name: "text-xl",
    subtitle: "text-[10px]",
  },
};

export function BrandLogo({
  size = "md",
  variant = "wordmark",
  tone = "default",
  subtitle,
  className,
}: BrandLogoProps) {
  const styles = sizeStyles[size];

  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden border border-primary/20 bg-white p-0.5 shadow-sm transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105",
          styles.mark,
        )}
      >
        <img
          src="/logo.png"
          alt={variant === "icon" ? "RestoManager logo" : ""}
          draggable={false}
          className="size-full scale-125 object-contain"
        />
      </span>

      {variant === "wordmark" ? (
        <span className="min-w-0 leading-tight">
          <span
            className={cn(
              "block font-bold tracking-tight",
              styles.name,
              tone === "inverse" ? "text-background" : "text-foreground",
            )}
          >
            <span className="text-primary">Resto</span>Manager
          </span>

          {subtitle ? (
            <span
              className={cn(
                "hidden truncate font-medium tracking-wide sm:block",
                styles.subtitle,
                tone === "inverse"
                  ? "text-background/60"
                  : "text-muted-foreground",
              )}
            >
              {subtitle}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
