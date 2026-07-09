import { requireRole } from "@/middlewares/auth.middleware.js";
import { CategoryOwnerRoutes } from "@/modules/category/routes/owner.routes.js";
import { MenuItemOwnerRoutes } from "@/modules/menuItem/routes/owner.routes.js";
import { CustomerOrderRoutes } from "@/modules/orders/routes/customer.routes.js";
import { OwnerOrderRoutes } from "@/modules/orders/routes/owner.routes.js";
import { AdminRestaurantRoutes } from "@/modules/restaurant/routes/admin.routes.js";
import { RestaurantOwnerRoutes } from "@/modules/restaurant/routes/owner.routes.js";
import { PublicRestaurantRoutes } from "@/modules/restaurant/routes/public.routes.js";
import { sendResponse } from "@/utils/sendResponse.js";
import Router, { Request, Response, NextFunction } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
  });
});

router.use("/admin/restaurants", requireRole("admin"), AdminRestaurantRoutes);

router.use("/owner/restaurant", RestaurantOwnerRoutes);
router.use(
  "/owner/categories",
  requireRole("restaurant_owner"),
  CategoryOwnerRoutes,
);
router.use(
  "/owner/menu-items",
  requireRole("restaurant_owner"),
  MenuItemOwnerRoutes,
);
router.use("/owner/orders", requireRole("restaurant_owner"), OwnerOrderRoutes);

router.use("/customer/orders", requireRole("customer"), CustomerOrderRoutes);

router.use("/restaurants", PublicRestaurantRoutes);

router.use((req: Request, res: Response, next: NextFunction) => {
  sendResponse(res, 404, {
    success: false,
    message: `Cannot find ${req.method} ${req.originalUrl} on this server.`,
  });
});

export { router as Routes };
