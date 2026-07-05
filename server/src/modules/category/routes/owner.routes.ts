import { Router } from "express";

import {
  createCategory,
  deleteCategory,
  updateCategory,
  getRestaurantCategoriesForOwner,
  restoreCategory,
} from "../controllers/owner.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@restomanager/validators";

const router = Router();

router.get("/", getRestaurantCategoriesForOwner);

router.post("/", validate(createCategorySchema), createCategory);

router.patch("/:categoryId", validate(updateCategorySchema), updateCategory);

router.delete("/:categoryId", deleteCategory);
router.patch("/:categoryId/restore", restoreCategory);

export { router as CategoryOwnerRoutes };
