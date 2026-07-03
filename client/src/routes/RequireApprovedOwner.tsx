import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { normalizeRole } from "../auth/auth-types";
import { api } from "@/lib/axios";
import { RouteLoadingState } from "@/components/RouteLoadingState";

interface RequireApprovedOwnerProps {
  children: React.ReactNode;
}

type RestaurantStatus = "pending" | "approved" | "rejected";

export default function RequireApprovedOwner({
  children,
}: RequireApprovedOwnerProps) {
  const { data, isPending } = authClient.useSession();

  const [status, setStatus] = useState<RestaurantStatus | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusError, setStatusError] = useState(false);

  const userRole = data?.user.role;
  const normalized = normalizeRole(userRole);

  useEffect(() => {
    if (!data?.session || normalized !== "restaurant_owner") {
      return;
    }

    const checkRestaurantStatus = async () => {
      try {
        setIsCheckingStatus(true);
        setStatusError(false);

        const response = await api.get("/owner/restaurant/status");

        const data = response.data.data;

        setStatus(data.status);
      } catch {
        setStatusError(true);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkRestaurantStatus();
  }, [data?.session, normalized]);

  if (isPending || isCheckingStatus || status === null) {
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

  if (statusError) {
    return <Navigate to="/owner/pending" replace />;
  }

  if (status !== "approved") {
    console.log(status)
    return <Navigate to="/owner/pending" replace />;
  }

  return <>{children}</>;
}
