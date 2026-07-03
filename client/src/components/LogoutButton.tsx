import { useState } from "react";
import { LogOut, LoaderCircle } from "lucide-react";
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
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
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
      // toast.promise already shows the error
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="inline-flex h-9 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive">
        <LogOut className="size-4" aria-hidden="true" />
        Logout
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <LogOut className="size-6" aria-hidden="true" />
          </AlertDialogMedia>

          <AlertDialogTitle>Log out of your account?</AlertDialogTitle>

          <AlertDialogDescription>
            You will need to log in again to access your dashboard and account
            features.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={isLoggingOut}
            onClick={(event) => {
              event.preventDefault();
              void handleLogout();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoggingOut ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="size-4" />
                Log out
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
