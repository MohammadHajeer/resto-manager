import React from "react";
import { Navigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { getDashboardPath } from "../auth/auth-types";
import { RouteLoadingState } from "@/components/RouteLoadingState";

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <RouteLoadingState
        title="Preparing page"
        description="We are checking your session before showing this page."
      />
    );
  }

  if (data?.session) {
    const userRole = data?.user.role;
    const redirectPath = getDashboardPath(userRole);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
