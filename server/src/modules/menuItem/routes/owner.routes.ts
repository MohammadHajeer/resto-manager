import { Router } from "express";

import {
  createMenuItem,
  deleteMenuItem,
  getMyMenuItemById,
  getMyMenuItems,
  restoreMenuItem,
  updateMenuItem,
} from "../controllers/owner.controller.js";
import { uploadMenuItemImage } from "@/middlewares/upload.middleware.js";

const router = Router();

router.get("/", getMyMenuItems);
router.post("/", uploadMenuItemImage, createMenuItem);
router.get("/:menuItemId", getMyMenuItemById);
router.patch("/:menuItemId", uploadMenuItemImage, updateMenuItem);
router.delete("/:menuItemId", deleteMenuItem);
router.patch("/:menuItemId/restore", restoreMenuItem);

export { router as MenuItemOwnerRoutes };
