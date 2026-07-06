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
import { validate } from "@/middlewares/validate.middleware.js";
import { restaurantProfileUpdateSchema } from "@restomanager/validators";

const router = Router();

router.post("/register", uploadRestaurantRegistrationFiles, registerRestaurant);

router.get("/", requireRole("restaurant_owner"), getMyRestaurant);

router.get(
  "/status",
  requireRole("restaurant_owner"),
  getOwnerRestaurantStatus,
);

router.patch(
  "/",
  requireRole("restaurant_owner"),
  validate(restaurantProfileUpdateSchema),
  updateMyRestaurant,
);

router.patch(
  "/open-status",
  requireRole("restaurant_owner"),
  toggleMyRestaurantOpenStatus,
);

export { router as RestaurantOwnerRoutes };
