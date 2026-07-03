import React from "react";
import { Navigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { normalizeRole, type UserRole } from "../auth/auth-types";
import { RouteLoadingState } from "@/components/RouteLoadingState";

interface RoleRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <RouteLoadingState
        title="Checking permissions"
        description="We are verifying that your account has access to this page."
      />
    );
  }

  const userRole = data?.user.role;
  const normalized = normalizeRole(userRole);

  if (!data?.session || !normalized || !allowedRoles.includes(normalized)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
