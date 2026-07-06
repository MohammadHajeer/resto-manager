import React from "react";
import { Navigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { normalizeRole } from "../auth/auth-types";
import { OwnerStatusErrorState } from "@/components/owner/OwnerStatusErrorState";
import { RouteLoadingState } from "@/components/RouteLoadingState";
import { useOwnerRestaurantStatus } from "@/hooks/owner/useOwnerRestaurant";

interface RequireApprovedOwnerProps {
  children: React.ReactNode;
}

export default function RequireApprovedOwner({
  children,
}: RequireApprovedOwnerProps) {
  const { data, isPending } = authClient.useSession();
  const userRole = data?.user.role;
  const normalized = normalizeRole(userRole);
  const shouldCheckStatus =
    Boolean(data?.session) && normalized === "restaurant_owner";
  const statusQuery = useOwnerRestaurantStatus(shouldCheckStatus);

  if (isPending) {
    return (
      <RouteLoadingState
        title="Checking restaurant approval"
        description="We are verifying your restaurant approval status before opening the owner dashboard."
      />
    );
  }

  if (!data?.session || normalized !== "restaurant_owner") {
    return <Navigate to="/" replace />;
  }

  if (statusQuery.isPending) {
    return (
      <RouteLoadingState
        title="Checking restaurant approval"
        description="We are verifying your restaurant approval status before opening the owner dashboard."
      />
    );
  }

  if (statusQuery.isError) {
    return (
      <OwnerStatusErrorState
        onRetry={() => void statusQuery.refetch()}
        isRetrying={statusQuery.isFetching}
      />
    );
  }

  if (statusQuery.data.status !== "approved") {
    return <Navigate to="/owner/status" replace />;
  }

  return <>{children}</>;
}
