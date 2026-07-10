import { Router } from "express";
import {
  getPublicRestaurantBySlug,
  getPublicRestaurantsFilterOptions,
  getPublicRestaurants,
} from "../controllers/public.controller.js";

const router = Router();

router.get("/", getPublicRestaurants);

router.get("/filter-options", getPublicRestaurantsFilterOptions);

router.get("/:slug", getPublicRestaurantBySlug);

export { router as PublicRestaurantRoutes };
