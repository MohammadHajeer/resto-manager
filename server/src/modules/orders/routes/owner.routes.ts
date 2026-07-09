import { Router } from "express";

import {
  getOwnerKitchenOrders,
  updateOwnerOrderStatus,
} from "../controllers/owner.controller.js";

const router = Router();

router.get("/kitchen", getOwnerKitchenOrders);

router.patch("/:orderId/status", updateOwnerOrderStatus);

export { router as OwnerOrderRoutes };
