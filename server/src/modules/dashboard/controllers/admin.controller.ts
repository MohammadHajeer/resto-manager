import type { NextFunction, Request, Response } from "express";

import { Order } from "@/modules/orders/orders.model.js";
import { Restaurant } from "@/modules/restaurant/restaurant.model.js";
import { AuthUser } from "@/modules/users/user.model.js";
import { sendResponse } from "@/utils/sendResponse.js";

const supportedPeriods = [7, 30] as const;
const restaurantStatuses = [
  "pending",
  "approved",
  "rejected",
  "suspended",
] as const;
const orderStatuses = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "completed",
  "cancelled",
] as const;
const activeOrderStatuses = ["accepted", "preparing", "ready"] as const;

type DashboardPeriod = (typeof supportedPeriods)[number];
type CountByKeyResult = { _id: string; count: number };
type CountByDateResult = { _id: string; orders: number };

type RestaurantAggregation = {
  summary: Array<{
    totalRestaurants: number;
    pendingRestaurants: number;
    approvedRestaurants: number;
    rejectedRestaurants: number;
    suspendedRestaurants: number;
  }>;
  byStatus: CountByKeyResult[];
  pendingRestaurants: Array<{
    _id: unknown;
    name: string;
    slug: string;
    logoUrl?: string | null;
    cuisineTypes: string[];
    city: string;
    ownerName?: string;
    createdAt: Date;
  }>;
};

type OrderAggregation = {
  summary: Array<{
    totalOrders: number;
    activeOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
  }>;
  byStatus: CountByKeyResult[];
  byDate: CountByDateResult[];
  recentOrders: Array<{
    _id: unknown;
    restaurantName?: string;
    itemCount: number;
    total: number;
    status: string;
    createdAt: Date;
  }>;
};

const getPeriod = (value: unknown): DashboardPeriod => {
  const parsed = Number(value);
  return supportedPeriods.includes(parsed as DashboardPeriod)
    ? (parsed as DashboardPeriod)
    : 7;
};

const getUtcDateKey = (date: Date) => date.toISOString().slice(0, 10);

const fillDateSeries = (
  startDate: Date,
  period: DashboardPeriod,
  results: CountByDateResult[],
) => {
  const counts = new Map(results.map((result) => [result._id, result.orders]));

  return Array.from({ length: period }, (_, index) => {
    const date = new Date(startDate);
    date.setUTCDate(startDate.getUTCDate() + index);
    const dateKey = getUtcDateKey(date);

    return { date: dateKey, orders: counts.get(dateKey) ?? 0 };
  });
};

export const getAdminDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const period = getPeriod(req.query.days);
    const now = new Date();
    const startDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    startDate.setUTCDate(startDate.getUTCDate() - (period - 1));

    const [restaurantResults, orderResults, totalCustomers] = await Promise.all([
      Restaurant.aggregate<RestaurantAggregation>([
        {
          $facet: {
            summary: [
              {
                $group: {
                  _id: null,
                  totalRestaurants: { $sum: 1 },
                  pendingRestaurants: {
                    $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
                  },
                  approvedRestaurants: {
                    $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
                  },
                  rejectedRestaurants: {
                    $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
                  },
                  suspendedRestaurants: {
                    $sum: { $cond: [{ $eq: ["$status", "suspended"] }, 1, 0] },
                  },
                },
              },
              { $project: { _id: 0 } },
            ],
            byStatus: [
              { $group: { _id: "$status", count: { $sum: 1 } } },
            ],
            pendingRestaurants: [
              { $match: { status: "pending" } },
              { $sort: { createdAt: -1 } },
              { $limit: 5 },
              {
                $lookup: {
                  from: "user",
                  localField: "ownerId",
                  foreignField: "_id",
                  as: "owner",
                },
              },
              { $set: { owner: { $first: "$owner" } } },
              {
                $project: {
                  name: 1,
                  slug: 1,
                  logoUrl: 1,
                  cuisineTypes: 1,
                  city: "$address.city",
                  ownerName: "$owner.name",
                  createdAt: 1,
                },
              },
            ],
          },
        },
      ]),
      Order.aggregate<OrderAggregation>([
        {
          $facet: {
            summary: [
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },
                  activeOrders: {
                    $sum: {
                      $cond: [{ $in: ["$status", activeOrderStatuses] }, 1, 0],
                    },
                  },
                  pendingOrders: {
                    $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
                  },
                  completedOrders: {
                    $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                  },
                  cancelledOrders: {
                    $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
                  },
                },
              },
              { $project: { _id: 0 } },
            ],
            byStatus: [
              { $group: { _id: "$status", count: { $sum: 1 } } },
            ],
            byDate: [
              { $match: { createdAt: { $gte: startDate } } },
              {
                $group: {
                  _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                  },
                  orders: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
            ],
            recentOrders: [
              { $sort: { createdAt: -1 } },
              { $limit: 5 },
              {
                $lookup: {
                  from: Restaurant.collection.name,
                  localField: "restaurantId",
                  foreignField: "_id",
                  as: "restaurant",
                },
              },
              { $set: { restaurant: { $first: "$restaurant" } } },
              {
                $project: {
                  restaurantName: "$restaurant.name",
                  itemCount: { $sum: "$items.quantity" },
                  total: "$totalPrice",
                  status: 1,
                  createdAt: 1,
                },
              },
            ],
          },
        },
      ]),
      AuthUser.countDocuments({ role: "customer" }),
    ]);

    const restaurantData = restaurantResults[0];
    const orderData = orderResults[0];
    const restaurantSummary = restaurantData?.summary[0] ?? {
      totalRestaurants: 0,
      pendingRestaurants: 0,
      approvedRestaurants: 0,
      rejectedRestaurants: 0,
      suspendedRestaurants: 0,
    };
    const orderSummary = orderData?.summary[0] ?? {
      totalOrders: 0,
      activeOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
    };
    const restaurantCounts = new Map(
      (restaurantData?.byStatus ?? []).map((entry) => [entry._id, entry.count]),
    );
    const orderCounts = new Map(
      (orderData?.byStatus ?? []).map((entry) => [entry._id, entry.count]),
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Admin dashboard fetched successfully",
      data: {
        statistics: {
          ...restaurantSummary,
          totalCustomers,
          ...orderSummary,
        },
        period,
        restaurantsByStatus: restaurantStatuses.map((status) => ({
          status,
          count: restaurantCounts.get(status) ?? 0,
        })),
        ordersByStatus: orderStatuses.map((status) => ({
          status,
          count: orderCounts.get(status) ?? 0,
        })),
        ordersByDate: fillDateSeries(
          startDate,
          period,
          orderData?.byDate ?? [],
        ),
        pendingRestaurants: (restaurantData?.pendingRestaurants ?? []).map(
          (restaurant) => ({
            id: restaurant._id,
            name: restaurant.name,
            slug: restaurant.slug,
            logoUrl: restaurant.logoUrl ?? null,
            cuisineTypes: restaurant.cuisineTypes,
            city: restaurant.city,
            ownerName: restaurant.ownerName,
            createdAt: restaurant.createdAt,
          }),
        ),
        recentOrders: (orderData?.recentOrders ?? []).map((order) => ({
          id: order._id,
          orderCode: `RM-${String(order._id).slice(-6).toUpperCase()}`,
          restaurantName: order.restaurantName ?? "Unknown restaurant",
          itemCount: order.itemCount,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
