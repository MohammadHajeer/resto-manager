import type { NextFunction, Response } from "express";
import { Types } from "mongoose";

import { sendResponse } from "@/utils/sendResponse.js";
import type {
  CreateAddressInput,
  UpdateAddressInput,
} from "@restomanager/validators";
import { Address } from "./address.model.js";

export const getMyAddresses = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.auth!.user.id;

    const addresses = await Address.find({
      userId,
    })
      .sort({
        isDefault: -1,
        createdAt: -1,
      })
      .lean();

    return sendResponse(res, 200, {
      success: true,
      message: "Addresses fetched successfully",
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

export const createAddress = async (
  req: AuthedRequest<{}, {}, CreateAddressInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.auth!.user.id;

    const addressCount = await Address.countDocuments({
      userId,
    });

    const shouldBeDefault = req.body.isDefault === true || addressCount === 0;

    if (shouldBeDefault) {
      await Address.updateMany(
        {
          userId,
          isDefault: true,
        },
        {
          $set: {
            isDefault: false,
          },
        },
      );
    }

    const address = await Address.create({
      userId,
      label: req.body.label,
      city: req.body.city,
      street: req.body.street,
      building: req.body.building,
      floor: req.body.floor ?? "",
      phoneNumber: req.body.phoneNumber,
      isDefault: shouldBeDefault,
    });

    return sendResponse(res, 201, {
      success: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (
  req: AuthedRequest<{ addressId: string }, {}, UpdateAddressInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.auth!.user.id;
    const { addressId } = req.params;

    if (!Types.ObjectId.isValid(addressId)) {
      return sendResponse(res, 400, {
        success: false,
        message: "Invalid address id",
      });
    }

    const existingAddress = await Address.findOne({
      _id: addressId,
      userId,
    });

    if (!existingAddress) {
      return sendResponse(res, 404, {
        success: false,
        message: "Address not found",
      });
    }

    const updateData: UpdateAddressInput = {};

    if (typeof req.body.label === "string") {
      updateData.label = req.body.label;
    }

    if (typeof req.body.city === "string") {
      updateData.city = req.body.city;
    }

    if (typeof req.body.street === "string") {
      updateData.street = req.body.street;
    }

    if (typeof req.body.building === "string") {
      updateData.building = req.body.building;
    }

    if (typeof req.body.floor === "string") {
      updateData.floor = req.body.floor;
    }

    if (typeof req.body.phoneNumber === "string") {
      updateData.phoneNumber = req.body.phoneNumber;
    }

    if (req.body.isDefault === true) {
      await Address.updateMany(
        {
          userId,
          _id: {
            $ne: addressId,
          },
          isDefault: true,
        },
        {
          $set: {
            isDefault: false,
          },
        },
      );

      updateData.isDefault = true;
    }

    const updatedAddress = await Address.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    next(error);
  }
};

export const setDefaultAddress = async (
  req: AuthedRequest<{ addressId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.auth!.user.id;
    const { addressId } = req.params;

    if (!Types.ObjectId.isValid(addressId)) {
      return sendResponse(res, 400, {
        success: false,
        message: "Invalid address id",
      });
    }

    const address = await Address.findOne({
      _id: addressId,
      userId,
    });

    if (!address) {
      return sendResponse(res, 404, {
        success: false,
        message: "Address not found",
      });
    }

    await Address.updateMany(
      {
        userId,
        isDefault: true,
      },
      {
        $set: {
          isDefault: false,
        },
      },
    );

    address.isDefault = true;

    await address.save();

    return sendResponse(res, 200, {
      success: true,
      message: "Default address updated successfully",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (
  req: AuthedRequest<{ addressId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.auth!.user.id;
    const { addressId } = req.params;

    if (!Types.ObjectId.isValid(addressId)) {
      return sendResponse(res, 400, {
        success: false,
        message: "Invalid address id",
      });
    }

    const address = await Address.findOne({
      _id: addressId,
      userId,
    });

    if (!address) {
      return sendResponse(res, 404, {
        success: false,
        message: "Address not found",
      });
    }

    const wasDefault = address.isDefault;

    await address.deleteOne();

    if (wasDefault) {
      const nextDefaultAddress = await Address.findOne({
        userId,
      }).sort({
        createdAt: -1,
      });

      if (nextDefaultAddress) {
        nextDefaultAddress.isDefault = true;
        await nextDefaultAddress.save();
      }
    }

    return sendResponse(res, 200, {
      success: true,
      message: "Address deleted successfully",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};
