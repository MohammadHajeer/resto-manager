import { Router } from "express";
import {
  createOrder,
  getMyCurrentOrders,
  getMyOrderById,
  getMyOrderHistory,
} from "../controllers/customer.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { createOrderSchema } from "@restomanager/validators";

const router = Router();

// RES-95: validate the order payload against the shared zod schema before
// it reaches the controller. The controller still re-verifies everything
// against the database (item ownership, availability, addon/ingredient
// names, prices) — this layer rejects malformed payloads early with a
// consistent validation error shape.
router.post("/", validate(createOrderSchema), createOrder);

router.get("/current", getMyCurrentOrders);

router.get("/history", getMyOrderHistory);

router.get("/:orderId", getMyOrderById);

export { router as CustomerOrderRoutes };
