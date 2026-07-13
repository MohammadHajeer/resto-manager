import { api } from "@/lib/axios";

import type {
  OwnerDashboardPeriod,
  OwnerDashboardResponse,
} from "./owner.types";

const endpoint = "/owner/dashboard";

export const ownerDashboardService = {
  getDashboard: async (
    period: OwnerDashboardPeriod,
  ): Promise<OwnerDashboardResponse> => {
    const response = await api.get(endpoint, {
      params: { days: period },
    });

    return response.data.data;
  },
};
