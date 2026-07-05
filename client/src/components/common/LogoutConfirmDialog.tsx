import { useState } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type LogoutConfirmDialogProps = {
  triggerClassName?: string;
  triggerVariant?: "header" | "sidebar";
};

export function LogoutConfirmDialog({
  triggerClassName,
  triggerVariant = "header",
}: LogoutConfirmDialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    const logoutPromise = authClient.signOut();

    toast.promise(logoutPromise, {
      loading: "Logging you out...",
      success: "Logged out successfully.",
      error: "Failed to log out. Please try again.",
    });

    try {
      await logoutPromise;
      setOpen(false);
      navigate("/login", { replace: true });
    } catch {
      // toast.promise presents the sign-out error.
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isLoggingOut) setOpen(nextOpen);
      }}
    >
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size={triggerVariant === "sidebar" ? "lg" : "default"}
            aria-label="Sign out"
            className={cn(
              "text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:border-destructive/30 focus-visible:ring-destructive/20",
              triggerVariant === "sidebar"
                ? "w-full justify-start rounded-md"
                : "rounded-full",
              triggerClassName,
            )}
          />
        }
      >
        <LogOut className="size-4" aria-hidden="true" />
        <span className={triggerVariant === "header" ? "hidden sm:inline" : ""}>
          Sign out
        </span>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-lg border border-border bg-card p-0 text-card-foreground shadow-xl sm:max-w-md">
        <AlertDialogHeader className="gap-2 p-6 sm:gap-x-4">
          <AlertDialogMedia className="mb-1 size-12 bg-destructive/10 text-destructive sm:mb-0">
            <LogOut className="size-5" aria-hidden="true" />
          </AlertDialogMedia>

          <AlertDialogTitle className="text-xl font-semibold text-foreground">
            Sign out?
          </AlertDialogTitle>

          <AlertDialogDescription className="leading-6 text-muted-foreground">
            Are you sure you want to sign out of your account? You will need to
            log in again to access the dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="border-t border-border bg-muted/30 p-4 sm:px-6">
          <AlertDialogCancel
            size="lg"
            disabled={isLoggingOut}
            className="rounded-md"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            variant="destructive"
            size="lg"
            disabled={isLoggingOut}
            onClick={(event) => {
              event.preventDefault();
              void handleLogout();
            }}
            className="rounded-md"
          >
            {isLoggingOut ? (
              <>
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
