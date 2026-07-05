import { Router } from "express";
import {
  getPublicRestaurantBySlug,
  getPublicRestaurantFilterOptions,
  getPublicRestaurants,
} from "../controllers/public.controller.js";

const router = Router();

router.get("/", getPublicRestaurants);

router.get("/filter-options", getPublicRestaurantFilterOptions);

router.get("/:slug", getPublicRestaurantBySlug);

export { router as PublicRestaurantRoutes };
