import React from "react";
import { Navigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { normalizeRole, type UserRole } from "../auth/auth-types";

interface RoleRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAF9] text-[#0F172A]">
        <div className="text-lg font-medium animate-pulse">
          Checking permissions...
        </div>
      </div>
    );
  }

  const userRole = data?.user.role;
  const normalized = normalizeRole(userRole);

  if (!data?.session || !normalized || !allowedRoles.includes(normalized)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
