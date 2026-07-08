// src/components/ServerConnectionToast.tsx
import { useEffect } from "react";
import { toast } from "sonner";
import { WifiOff } from "lucide-react";

import { useServerHealth } from "@/hooks/useServerHealth";

export function ServerConnectionToast() {
  const { isError, isSuccess } = useServerHealth();

  useEffect(() => {
    if (isError) {
      toast.error("Server connection lost", {
        id: "server-connection",
        description:
          "Some actions may not work until the server is back online.",
        icon: <WifiOff className="h-4 w-4" />,
        duration: Infinity,
      });
    }

    if (isSuccess) {
      toast.dismiss("server-connection");
    }
  }, [isError, isSuccess]);

  return null;
}
