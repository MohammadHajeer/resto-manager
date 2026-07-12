import { api } from "@/lib/axios";

import type {
  AdminDashboardPeriod,
  AdminDashboardResponse,
} from "./admin.types";

export const adminDashboardService = {
  getDashboard: async (
    period: AdminDashboardPeriod,
  ): Promise<AdminDashboardResponse> => {
    const response = await api.get("/admin/dashboard", {
      params: { days: period },
    });

    return response.data.data;
  },
};
