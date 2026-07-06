import { Router } from "express";

import {
  createMenuItem,
  deleteMenuItem,
  getMyMenuItemById,
  getMyMenuItems,
  restoreMenuItem,
  updateMenuItem,
} from "../controllers/owner.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import {
  createMenuItemSchema,
  updateMenuItemSchema,
} from "@restomanager/validators";

const router = Router();

router.get("/", getMyMenuItems);
router.post("/", validate(createMenuItemSchema), createMenuItem);
router.get("/:menuItemId", getMyMenuItemById);
router.patch("/:menuItemId", validate(updateMenuItemSchema), updateMenuItem);
router.delete("/:menuItemId", deleteMenuItem);
router.patch("/:menuItemId/restore", restoreMenuItem);

export { router as MenuItemOwnerRoutes };
