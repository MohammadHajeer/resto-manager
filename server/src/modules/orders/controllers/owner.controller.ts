import type { NextFunction, Response } from "express";
import { isValidObjectId, Types } from "mongoose";

import type { OrderStatus } from "@restomanager/validators";

import { sendResponse } from "@/utils/sendResponse.js";
import { Restaurant } from "@/modules/restaurant/restaurant.model.js";
import { Order, OrderDocument } from "../orders.model.js";

const kitchenStatuses = ["pending", "preparing", "ready"] as const;

type KitchenStatus = (typeof kitchenStatuses)[number];

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ["preparing", "cancelled"],
  accepted: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["completed"],
  completed: [],
  cancelled: [],
};

const getNextActionLabel = (status: OrderStatus) => {
  if (status === "pending") return "Start Preparing";
  if (status === "preparing") return "Mark as Ready";
  if (status === "ready") return "Complete Order";

  return null;
};

const getNextStatus = (status: OrderStatus): OrderStatus | null => {
  if (status === "pending") return "preparing";
  if (status === "preparing") return "ready";
  if (status === "ready") return "completed";

  return null;
};

const formatKitchenOrder = (order: OrderDocument) => {
  const itemCount = order.items.reduce((total: number, item) => {
    return total + item.quantity;
  }, 0);

  return {
    _id: order._id,
    orderCode: `RM-${String(order._id).slice(-6).toUpperCase()}`,

    customerId: order.customerId,

    deliveryAddress: order.deliveryAddress,

    items: order.items,

    itemCount,

    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    totalPrice: order.totalPrice,

    status: order.status,
    customerNote: order.customerNote,

    nextStatus: getNextStatus(order.status),
    nextActionLabel: getNextActionLabel(order.status),

    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};

const getRestaurantForOwner = async (ownerId: string) => {
  if (!isValidObjectId(ownerId)) return null;

  return Restaurant.findOne({
    ownerId: new Types.ObjectId(ownerId),
  }).lean();
};

export const getOwnerKitchenOrders = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.auth!.user.id;

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return sendResponse(res, 404, {
        success: false,
        message: "Restaurant not found for this owner",
      });
    }

    const orders = await Order.find({
      restaurantId: restaurant._id,
      status: {
        $in: kitchenStatuses,
      },
    })
      .sort({ createdAt: 1 })
      .lean();

    const groupedOrders: Record<
      KitchenStatus,
      ReturnType<typeof formatKitchenOrder>[]
    > = {
      pending: [],
      preparing: [],
      ready: [],
    };

    for (const order of orders) {
      const status = order.status as KitchenStatus;

      groupedOrders[status].push(formatKitchenOrder(order));
    }

    const counts = {
      pending: groupedOrders.pending.length,
      preparing: groupedOrders.preparing.length,
      ready: groupedOrders.ready.length,
      total:
        groupedOrders.pending.length +
        groupedOrders.preparing.length +
        groupedOrders.ready.length,
    };

    return sendResponse(res, 200, {
      success: true,
      message: "Kitchen orders fetched successfully",
      data: {
        counts,
        columns: groupedOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOwnerOrderStatus = async (
  req: AuthedRequest<{ orderId: string }, {}, { status: OrderStatus }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.auth!.user.id;
    
    const { orderId } = req.params;
    const { status: nextStatus } = req.body;

    if (!isValidObjectId(orderId)) {
      return sendResponse(res, 400, {
        success: false,
        message: "Invalid order ID",
      });
    }

    const validStatuses: OrderStatus[] = [
      "pending",
      "accepted",
      "preparing",
      "ready",
      "completed",
      "cancelled",
    ];

    if (!validStatuses.includes(nextStatus)) {
      return sendResponse(res, 400, {
        success: false,
        message: "Invalid order status",
      });
    }

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return sendResponse(res, 404, {
        success: false,
        message: "Restaurant not found for this owner",
      });
    }

    const order = await Order.findOne({
      _id: new Types.ObjectId(orderId),
      restaurantId: restaurant._id,
    });

    if (!order) {
      return sendResponse(res, 404, {
        success: false,
        message: "Order not found",
      });
    }

    const currentStatus = order.status as OrderStatus;

    if (currentStatus === nextStatus) {
      return sendResponse(res, 200, {
        success: true,
        message: "Order status is already up to date",
        data: formatKitchenOrder(order),
      });
    }

    const allowedNextStatuses = allowedTransitions[currentStatus];

    if (!allowedNextStatuses.includes(nextStatus)) {
      return sendResponse(res, 400, {
        success: false,
        message: `Cannot move order from ${currentStatus} to ${nextStatus}`,
      });
    }

    order.status = nextStatus;

    await order.save();

    return sendResponse(res, 200, {
      success: true,
      message: "Order status updated successfully",
      data: formatKitchenOrder(order),
    });
  } catch (error) {
    next(error);
  }
};
