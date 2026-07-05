import { Router } from "express";

import {
  getApprovedRestaurants,
  getRestaurantBySlug,
  getRestaurantMenuBySlug,
} from "../controllers/public.controller.js";

const router = Router();

router.get("/", getApprovedRestaurants);
router.get("/:slug/menu", getRestaurantMenuBySlug);
router.get("/:slug", getRestaurantBySlug);

export { router as PublicRestaurantRoutes };
