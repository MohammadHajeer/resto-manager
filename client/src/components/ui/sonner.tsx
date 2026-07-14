import type { CSSProperties, ReactNode } from "react";
import {
  CircleCheck,
  CircleX,
  Info,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { cn } from "@/lib/utils";

function ToastIcon({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <span
      className={cn(
        "flex size-8 items-center justify-center rounded-xl border shadow-xs",
        className,
      )}
    >
      {children}
    </span>
  );
}

const toasterStyle = {
  "--width": "min(25rem, calc(100vw - 2rem))",
  "--normal-bg": "var(--card)",
  "--normal-text": "var(--card-foreground)",
  "--normal-border": "var(--border)",
  "--border-radius": "calc(var(--radius) * 1.8)",
} as CSSProperties;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      closeButton
      gap={10}
      offset={16}
      mobileOffset={12}
      className="toaster group font-sans"
      icons={{
        success: (
          <ToastIcon className="border-success/25 bg-success/10 text-success">
            <CircleCheck className="size-4" aria-hidden="true" />
          </ToastIcon>
        ),
        error: (
          <ToastIcon className="border-destructive/20 bg-destructive/10 text-destructive">
            <CircleX className="size-4" aria-hidden="true" />
          </ToastIcon>
        ),
        loading: (
          <ToastIcon className="border-primary/20 bg-primary/10 text-primary">
            <LoaderCircle
              className="size-4 animate-spin"
              aria-hidden="true"
            />
          </ToastIcon>
        ),
        warning: (
          <ToastIcon className="border-warning/25 bg-warning/10 text-warning">
            <TriangleAlert className="size-4" aria-hidden="true" />
          </ToastIcon>
        ),
        info: (
          <ToastIcon className="border-primary/15 bg-secondary text-secondary-foreground">
            <Info className="size-4" aria-hidden="true" />
          </ToastIcon>
        ),
      }}
      style={toasterStyle}
      toastOptions={{
        closeButtonAriaLabel: "Dismiss notification",
        classNames: {
          toast:
            "resto-toast !items-start !gap-3 !rounded-2xl !border !px-4 !py-3.5 !pl-5 !pr-11 !text-card-foreground !transition-[transform,opacity,box-shadow] !duration-300 !ease-out motion-reduce:!transition-none",
          success: "resto-toast--success",
          error: "resto-toast--error",
          loading: "resto-toast--loading",
          warning: "resto-toast--warning",
          info: "resto-toast--info",
          content: "!min-w-0 !flex-1 !gap-1",
          title:
            "!whitespace-normal !break-words !text-sm !font-semibold !leading-5 !text-foreground",
          description:
            "!whitespace-normal !break-words !text-xs !leading-5 !text-muted-foreground",
          icon: "!mt-0.5 !size-8 !shrink-0 !items-center !justify-center",
          closeButton:
            "!left-auto !right-2 !top-2 !size-7 !transform-none !rounded-lg !border-border !bg-background/90 !text-muted-foreground !shadow-xs !backdrop-blur-sm hover:!border-border hover:!bg-muted hover:!text-foreground focus-visible:!border-ring focus-visible:!ring-2 focus-visible:!ring-ring/30",
          actionButton:
            "!h-8 !rounded-xl !border !border-primary !bg-primary !px-3 !text-xs !font-semibold !text-primary-foreground !shadow-sm hover:!bg-primary/90 focus-visible:!ring-2 focus-visible:!ring-ring/30",
          cancelButton:
            "!h-8 !rounded-xl !border !border-border !bg-background !px-3 !text-xs !font-semibold !text-foreground !shadow-xs hover:!bg-muted focus-visible:!ring-2 focus-visible:!ring-ring/30",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
