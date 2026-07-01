import React from "react";
import { Navigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAF9] text-[#0F172A]">
        <div className="text-lg font-medium animate-pulse">Loading session...</div>
      </div>
    );
  }

  if (!data?.session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
