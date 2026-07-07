import { MenuItem } from "@/modules/menuItem/menuItem.model.js";
import { CreateOrderInput } from "@restomanager/validators";
import type { NextFunction, Response } from "express";
import { Types } from "mongoose";
import { Order } from "../orders.model.js";
import { sendResponse } from "@/utils/sendResponse.js";

export const createOrder = async (
  req: AuthedRequest<{}, {}, CreateOrderInput>, // udpate this in the shared folder
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

    const menuItems = await MenuItem.find({
      _id: { $in: menuItemIds },
      restaurantId,
      deletedAt: null,
      isAvailable: true,
    }).lean();

    if (menuItems.length !== menuItemIds.length) {
      return sendResponse(res, 400, {
        success: false,
        message: "Some menu items are unavailable or do not exist",
      });
    }

    const menuItemMap = new Map(
      menuItems.map((menuItem) => [String(menuItem._id), menuItem]),
    );

    const orderItems = items.map((item) => {
      const menuItem = menuItemMap.get(item.menuItemId);

      if (!menuItem) {
        throw new Error("Menu item not found");
      }

      const selectedAddonNames = item.selectedAddonNames ?? [];

      const selectedAddons = selectedAddonNames.map((addonName) => {
        const addon = menuItem.availableAddons.find(
          (availableAddon) => availableAddon.name === addonName,
        );

        if (!addon) {
          throw new Error(`Invalid addon selected: ${addonName}`);
        }

        return {
          name: addon.name,
          price: addon.price,
        };
      });

      const addonsTotal = selectedAddons.reduce((total, addon) => {
        return total + addon.price;
      }, 0);

      const itemTotal = (menuItem.price + addonsTotal) * item.quantity;

      return {
        menuItemId: menuItem._id,
        name: menuItem.name,
        basePrice: menuItem.price,
        quantity: item.quantity,
        selectedAddons,
        itemTotal,
      };
    });

    const subtotal = orderItems.reduce((total, item) => {
      return total + item.itemTotal;
    }, 0);

    const deliveryFee = 0; // for now

    const totalPrice = subtotal + deliveryFee;

    const order = await Order.create({
      customerId,
      restaurantId,
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
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
