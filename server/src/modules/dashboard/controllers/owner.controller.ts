import type { NextFunction, Response } from "express";
import { isValidObjectId, Types } from "mongoose";

import { Category } from "@/modules/category/category.model.js";
import { MenuItem } from "@/modules/menuItem/menuItem.model.js";
import { Order } from "@/modules/orders/orders.model.js";
import { Restaurant } from "@/modules/restaurant/restaurant.model.js";
import { sendResponse } from "@/utils/sendResponse.js";

const supportedPeriods = [7, 30] as const;
const activeOrderStatuses = ["accepted", "preparing", "ready"] as const;

type DashboardPeriod = (typeof supportedPeriods)[number];

type OrderSummary = {
  totalOrders: number;
  activeOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  completedOrderValue: number;
};

type OrdersByDateResult = {
  _id: string;
  orders: number;
};

type OrdersByStatusResult = {
  _id: string;
  count: number;
};

type RecentOrderResult = {
  _id: Types.ObjectId;
  total: number;
  itemCount: number;
  status: string;
  createdAt: Date;
};

type OrderDashboardAggregation = {
  summary: OrderSummary[];
  ordersByDate: OrdersByDateResult[];
  ordersByStatus: OrdersByStatusResult[];
  recentOrders: RecentOrderResult[];
};

type MenuSummary = {
  totalMenuItems: number;
  availableMenuItems: number;
  unavailableMenuItems: number;
};

const getPeriod = (value: unknown): DashboardPeriod => {
  const parsed = Number(value);
  return supportedPeriods.includes(parsed as DashboardPeriod)
    ? (parsed as DashboardPeriod)
    : 7;
};

const getUtcDateKey = (date: Date) => date.toISOString().slice(0, 10);

const buildOrdersByDate = (
  startDate: Date,
  period: DashboardPeriod,
  results: OrdersByDateResult[],
) => {
  const counts = new Map(results.map((result) => [result._id, result.orders]));

  return Array.from({ length: period }, (_, index) => {
    const date = new Date(startDate);
    date.setUTCDate(startDate.getUTCDate() + index);
    const dateKey = getUtcDateKey(date);

    return {
      date: dateKey,
      orders: counts.get(dateKey) ?? 0,
    };
  });
};

export const getOwnerDashboard = async (
  req: AuthedRequest<{}, {}, {}, { days?: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.auth!.user.id;

    if (!isValidObjectId(ownerId)) {
      return sendResponse(res, 404, {
        success: false,
        message: "Restaurant not found for this owner",
      });
    }

    const restaurant = await Restaurant.findOne({
      ownerId: new Types.ObjectId(ownerId),
    })
      .select(
        "name slug isOpen logoUrl bannerUrl description openingHours status",
      )
      .lean();

    if (!restaurant) {
      return sendResponse(res, 404, {
        success: false,
        message: "Restaurant not found for this owner",
      });
    }

    const period = getPeriod(req.query.days);
    const now = new Date();
    const startDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    startDate.setUTCDate(startDate.getUTCDate() - (period - 1));

    const [orderResults, menuResults, categoryResults] = await Promise.all([
      Order.aggregate<OrderDashboardAggregation>([
        { $match: { restaurantId: restaurant._id } },
        {
          $facet: {
            summary: [
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },
                  activeOrders: {
                    $sum: {
                      $cond: [
                        { $in: ["$status", activeOrderStatuses] },
                        1,
                        0,
                      ],
                    },
                  },
                  pendingOrders: {
                    $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
                  },
                  completedOrders: {
                    $sum: {
                      $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
                    },
                  },
                  cancelledOrders: {
                    $sum: {
                      $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
                    },
                  },
                  completedOrderValue: {
                    $sum: {
                      $cond: [
                        { $eq: ["$status", "completed"] },
                        "$totalPrice",
                        0,
                      ],
                    },
                  },
                },
              },
              { $project: { _id: 0 } },
            ],
            ordersByDate: [
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
            ordersByStatus: [
              { $group: { _id: "$status", count: { $sum: 1 } } },
              { $sort: { _id: 1 } },
            ],
            recentOrders: [
              { $sort: { createdAt: -1 } },
              { $limit: 5 },
              {
                $project: {
                  total: "$totalPrice",
                  itemCount: { $sum: "$items.quantity" },
                  status: 1,
                  createdAt: 1,
                },
              },
            ],
          },
        },
      ]),
      MenuItem.aggregate<MenuSummary>([
        {
          $match: {
            restaurantId: restaurant._id,
            deletedAt: null,
          },
        },
        {
          $group: {
            _id: null,
            totalMenuItems: { $sum: 1 },
            availableMenuItems: {
              $sum: { $cond: ["$isAvailable", 1, 0] },
            },
            unavailableMenuItems: {
              $sum: { $cond: ["$isAvailable", 0, 1] },
            },
          },
        },
        { $project: { _id: 0 } },
      ]),
      Category.aggregate<{ totalCategories: number; categoriesWithoutItems: number }>([
        {
          $match: {
            restaurantId: restaurant._id,
            isActive: true,
          },
        },
        {
          $lookup: {
            from: MenuItem.collection.name,
            let: { categoryId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$categoryId", "$$categoryId"] },
                      { $eq: ["$deletedAt", null] },
                    ],
                  },
                },
              },
              { $limit: 1 },
            ],
            as: "menuItems",
          },
        },
        {
          $group: {
            _id: null,
            totalCategories: { $sum: 1 },
            categoriesWithoutItems: {
              $sum: {
                $cond: [{ $eq: [{ $size: "$menuItems" }, 0] }, 1, 0],
              },
            },
          },
        },
        { $project: { _id: 0 } },
      ]),
    ]);

    const orderData = orderResults[0];
    const orderSummary = orderData?.summary[0] ?? {
      totalOrders: 0,
      activeOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      completedOrderValue: 0,
    };
    const menuSummary = menuResults[0] ?? {
      totalMenuItems: 0,
      availableMenuItems: 0,
      unavailableMenuItems: 0,
    };
    const categorySummary = categoryResults[0] ?? {
      totalCategories: 0,
      categoriesWithoutItems: 0,
    };
    const configuredOpeningDays = new Set(
      restaurant.openingHours
        .filter(
          (hours) =>
            hours.isClosed ||
            (hours.openTime.trim().length > 0 && hours.closeTime.trim().length > 0),
        )
        .map((hours) => hours.day),
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Owner dashboard fetched successfully",
      data: {
        restaurant: {
          id: restaurant._id,
          name: restaurant.name,
          slug: restaurant.slug,
          isOpen: restaurant.isOpen,
          logoUrl: restaurant.logoUrl,
          bannerUrl: restaurant.bannerUrl,
          status: restaurant.status,
        },
        statistics: {
          ...orderSummary,
          ...menuSummary,
          totalCategories: categorySummary.totalCategories,
        },
        period,
        ordersByDate: buildOrdersByDate(
          startDate,
          period,
          orderData?.ordersByDate ?? [],
        ),
        ordersByStatus: (orderData?.ordersByStatus ?? []).map((entry) => ({
          status: entry._id,
          count: entry.count,
        })),
        recentOrders: (orderData?.recentOrders ?? []).map((order) => ({
          id: order._id,
          orderCode: `RM-${String(order._id).slice(-6).toUpperCase()}`,
          total: order.total,
          itemCount: order.itemCount,
          status: order.status,
          createdAt: order.createdAt,
        })),
        health: {
          categoriesWithoutItems: categorySummary.categoriesWithoutItems,
          hasCompleteOpeningHours: configuredOpeningDays.size === 7,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
