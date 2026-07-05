import { Router } from "express";
import {
  getAdminRestaurants,
  getRestaurantForAdmin,
  reviewRestaurantRegistration,
  suspendRestaurant,
} from "../controllers/admin.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { restaurantReviewSchema } from "@restomanager/validators";

const router = Router();

router.get("/", getAdminRestaurants);

router.get("/:restaurantId", getRestaurantForAdmin);

router.patch(
  "/:restaurantId/status",
  validate(restaurantReviewSchema),
  reviewRestaurantRegistration,
);

router.patch("/:restaurantId/suspend", suspendRestaurant);

export { router as AdminRestaurantRoutes };
