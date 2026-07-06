import { Router } from "express";
import { requireRole } from "@/middlewares/auth.middleware.js";
import {
  uploadRestaurantProfileFiles,
  uploadRestaurantRegistrationFiles,
} from "@/middlewares/upload.middleware.js";
import {
  getMyRestaurant,
  getOwnerRestaurantMenu,
  getOwnerRestaurantStatus,
  registerRestaurant,
  toggleMyRestaurantOpenStatus,
  updateMyRestaurant,
} from "../controllers/owner.controller.js";

const router = Router();

router.post("/register", uploadRestaurantRegistrationFiles, registerRestaurant);

router.get("/", requireRole("restaurant_owner"), getMyRestaurant);

router.get("/menu", requireRole("restaurant_owner"), getOwnerRestaurantMenu);

router.get(
  "/status",
  requireRole("restaurant_owner"),
  getOwnerRestaurantStatus,
);

router.patch(
  "/",
  requireRole("restaurant_owner"),
  uploadRestaurantProfileFiles,
  updateMyRestaurant,
);

router.patch(
  "/open-status",
  requireRole("restaurant_owner"),
  toggleMyRestaurantOpenStatus,
);

export { router as RestaurantOwnerRoutes };
