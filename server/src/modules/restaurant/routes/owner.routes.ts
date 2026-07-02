import { Router } from "express";
import { requireRole } from "@/middlewares/auth.middleware.js";
import { uploadRestaurantRegistrationFiles } from "@/middlewares/upload.middleware.js";
import {
  getMyRestaurant,
  registerRestaurant,
  toggleMyRestaurantOpenStatus,
  updateMyRestaurant,
} from "../controllers/owner.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { restaurantRegistrationSchema } from "@restomanager/validators";

const router = Router();

router.post(
  "/register",
  uploadRestaurantRegistrationFiles,
  validate(restaurantRegistrationSchema),
  registerRestaurant,
);

router.get("/", requireRole("restaurant_owner"), getMyRestaurant);

router.patch("/", requireRole("restaurant_owner"), updateMyRestaurant);

router.patch(
  "/open-status",
  requireRole("restaurant_owner"),
  toggleMyRestaurantOpenStatus,
);

export { router as RestaurantOwnerRoutes };
