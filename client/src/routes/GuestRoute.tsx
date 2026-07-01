import React from "react";
import { Navigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { getDashboardPath } from "../auth/auth-types";

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAF9] text-[#0F172A]">
        <div className="text-lg font-medium animate-pulse">Loading...</div>
      </div>
    );
  }

  if (data?.session) {
    const userRole = (data?.user as any)?.role;
    const redirectPath = getDashboardPath(userRole);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
