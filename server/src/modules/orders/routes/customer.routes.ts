import { Router } from "express";
import {
  createOrder,
  getMyCurrentOrders,
  getMyOrderById,
  getMyOrderHistory,
} from "../controllers/customer.controller.js";

const router = Router();

router.post("/", createOrder);

router.get("/current", getMyCurrentOrders);

router.get("/history", getMyOrderHistory);

router.get("/:orderId", getMyOrderById);

export { router as CustomerOrderRoutes };
