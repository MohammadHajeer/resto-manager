import React from "react";
import { Navigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { RouteLoadingState } from "@/components/RouteLoadingState";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <RouteLoadingState
        title="Loading session"
        description="We are checking your login status before continuing."
      />
    );
  }

  if (!data?.session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
