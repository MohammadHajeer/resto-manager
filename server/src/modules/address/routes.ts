import { Router } from "express";

import {
  createAddressSchema,
  updateAddressSchema,
} from "@restomanager/validators";

import {
  createAddress,
  deleteAddress,
  getMyAddresses,
  setDefaultAddress,
  updateAddress,
} from "./customer.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";

const router = Router();

router.get("/", getMyAddresses);

router.post("/", validate(createAddressSchema), createAddress);

router.patch("/:addressId", validate(updateAddressSchema), updateAddress);

router.patch("/:addressId/default", setDefaultAddress);

router.delete("/:addressId", deleteAddress);

export { router as CustomerAddressRoutes };
