import { MenuItem } from "@/modules/menuItem/menuItem.model.js";
import { sendResponse } from "@/utils/sendResponse.js";
import type { CreateOrderInput } from "@restomanager/validators";
import type { NextFunction, Response } from "express";
import { Types } from "mongoose";

import { Order } from "../orders.model.js";
import { getPagination } from "@/utils/pagination.js";

const activeOrderStatuses = [
  "pending",
  "accepted",
  "preparing",
  "ready",
] as const;

const historyOrderStatuses = ["completed", "cancelled"] as const;

type ActiveOrderStatus = (typeof activeOrderStatuses)[number];
type HistoryOrderStatus = (typeof historyOrderStatuses)[number];

const formatCustomerOrder = (order: any) => {
  return {
    ...order,
    orderCode: `RM-${String(order._id).slice(-6).toUpperCase()}`,
  };
};

export const createOrder = async (
  req: AuthedRequest<{}, {}, CreateOrderInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.auth!.user!.id;

    const {
      restaurantId,
      deliveryAddress,
      items,
      customerNote = "",
    } = req.body;

    if (!Types.ObjectId.isValid(restaurantId)) {
      return sendResponse(res, 400, {
        success: false,
        message: "Invalid restaurant id",
      });
    }

    if (!items || items.length === 0) {
      return sendResponse(res, 400, {
        success: false,
        message: "Order must contain at least one item",
      });
    }

    const customerObjectId = new Types.ObjectId(customerId);
    const restaurantObjectId = new Types.ObjectId(restaurantId);

    const menuItemIds = items.map((item) => item.menuItemId);

    const hasInvalidMenuItemId = menuItemIds.some(
      (menuItemId) => !Types.ObjectId.isValid(menuItemId),
    );

    if (hasInvalidMenuItemId) {
      return sendResponse(res, 400, {
        success: false,
        message: "Invalid menu item id",
      });
    }

    const uniqueMenuItemIds = [...new Set(menuItemIds)];

    const menuItems = await MenuItem.find({
      _id: {
        $in: uniqueMenuItemIds.map(
          (menuItemId) => new Types.ObjectId(menuItemId),
        ),
      },
      restaurantId: restaurantObjectId,
      deletedAt: null,
      isAvailable: true,
    }).lean();

    if (menuItems.length !== uniqueMenuItemIds.length) {
      return sendResponse(res, 400, {
        success: false,
        message: "Some menu items are unavailable or do not exist",
      });
    }

    const menuItemMap = new Map(
      menuItems.map((menuItem) => [String(menuItem._id), menuItem]),
    );

    const orderItems = [];

    for (const item of items) {
      const menuItem = menuItemMap.get(item.menuItemId);

      if (!menuItem) {
        return sendResponse(res, 400, {
          success: false,
          message: "Menu item not found",
        });
      }

      const selectedAddonNames = item.selectedAddonNames ?? [];

      const selectedAddons = [];

      for (const addonName of selectedAddonNames) {
        const addon = menuItem.availableAddons.find(
          (availableAddon) => availableAddon.name === addonName,
        );

        if (!addon) {
          return sendResponse(res, 400, {
            success: false,
            message: `Invalid addon selected: ${addonName}`,
          });
        }

        selectedAddons.push({
          name: addon.name,
          price: addon.price,
        });
      }

      const addonsTotal = selectedAddons.reduce((total, addon) => {
        return total + addon.price;
      }, 0);

      const itemTotal = (menuItem.price + addonsTotal) * item.quantity;

      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        basePrice: menuItem.price,
        quantity: item.quantity,
        selectedAddons,
        itemTotal,
      });
    }

    const subtotal = orderItems.reduce((total, item) => {
      return total + item.itemTotal;
    }, 0);

    const deliveryFee = 0;

    const totalPrice = subtotal + deliveryFee;

    const order = await Order.create({
      customerId: customerObjectId,
      restaurantId: restaurantObjectId,
      deliveryAddress,
      items: orderItems,
      subtotal,
      deliveryFee,
      totalPrice,
      customerNote,
    });

    return sendResponse(res, 201, {
      success: true,
      message: "Order created successfully",
      data: formatCustomerOrder(order.toObject()),
    });
  } catch (error) {
    next(error);
  }
};

export const getMyCurrentOrders = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.auth!.user!.id;

    const orders = await Order.find({
      customerId: new Types.ObjectId(customerId),
      status: {
        $in: activeOrderStatuses,
      },
    })
      .populate({
        path: "restaurantId",
        select: "name slug logoUrl",
      })
      .sort({ createdAt: -1 })
      .lean();

    return sendResponse(res, 200, {
      success: true,
      message: "Current orders fetched successfully",
      data: orders.map(formatCustomerOrder),
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrderHistory = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.auth!.user!.id;

    const { page, limit, skip } = getPagination(
      req.query.page,
      req.query.limit,
    );

    const status =
      typeof req.query.status === "string" ? req.query.status : null;

    const filter: Record<string, unknown> = {
      customerId: new Types.ObjectId(customerId),
      status: {
        $in: historyOrderStatuses,
      },
    };

    if (status) {
      if (status !== "completed" && status !== "cancelled") {
        return sendResponse(res, 400, {
          success: false,
          message: "Invalid history order status",
        });
      }

      filter.status = status;
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find(filter)
        .populate({
          path: "restaurantId",
          select: "name slug logoUrl",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Order.countDocuments(filter),
    ]);

    return sendResponse(res, 200, {
      success: true,
      message: "Order history fetched successfully",
      data: {
        orders: orders.map(formatCustomerOrder),
        pagination: {
          page,
          limit,
          totalOrders,
          totalPages: Math.ceil(totalOrders / limit),
          hasNextPage: page * limit < totalOrders,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrderById = async (
  req: AuthedRequest<{ orderId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.auth!.user!.id;
    const { orderId } = req.params;

    if (!Types.ObjectId.isValid(orderId)) {
      return sendResponse(res, 400, {
        success: false,
        message: "Invalid order id",
      });
    }

    const order = await Order.findOne({
      _id: new Types.ObjectId(orderId),
      customerId: new Types.ObjectId(customerId),
    })
      .populate({
        path: "restaurantId",
        select: "name slug logoUrl",
      })
      .lean();

    if (!order) {
      return sendResponse(res, 404, {
        success: false,
        message: "Order not found",
      });
    }

    return sendResponse(res, 200, {
      success: true,
      message: "Order fetched successfully",
      data: formatCustomerOrder(order),
    });
  } catch (error) {
    next(error);
  }
};
