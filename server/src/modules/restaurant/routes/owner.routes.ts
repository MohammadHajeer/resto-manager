import { Router } from "express";
import { requireRole } from "@/middlewares/auth.middleware.js";
import { uploadRestaurantRegistrationFiles } from "@/middlewares/upload.middleware.js";
import {
  getMyRestaurant,
  getOwnerRestaurantStatus,
  registerRestaurant,
  toggleMyRestaurantOpenStatus,
  updateMyRestaurant,
} from "../controllers/owner.controller.js";

const router = Router();

router.post(
  ["/register", "/restaurant/register"],
  uploadRestaurantRegistrationFiles,
  registerRestaurant,
);

router.get("/", requireRole("restaurant_owner"), getMyRestaurant);

router.get(
  "/restaurant/status",
  requireRole("restaurant_owner"),
  getOwnerRestaurantStatus,
);

router.patch("/", requireRole("restaurant_owner"), updateMyRestaurant);

router.patch(
  "/open-status",
  requireRole("restaurant_owner"),
  toggleMyRestaurantOpenStatus,
);

export { router as RestaurantOwnerRoutes };
