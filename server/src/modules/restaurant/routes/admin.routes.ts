import { Router } from "express";
import {
  getAllRestaurantsForAdmin,
  getPendingRestaurants,
  getRestaurantForAdmin,
  reviewRestaurantRegistration,
  suspendRestaurant,
} from "../controllers/admin.controller.js";
import { requireRole } from "@/middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireRole("admin"), getAllRestaurantsForAdmin);

router.get("/pending", requireRole("admin"), getPendingRestaurants);

router.get("/:restaurantId", requireRole("admin"), getRestaurantForAdmin);

router.patch(
  "/:restaurantId/review",
  requireRole("admin"),
  reviewRestaurantRegistration,
);

router.patch("/:restaurantId/suspend", requireRole("admin"), suspendRestaurant);

export { router as AdminRestaurantRoutes };
