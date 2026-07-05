import { AdminRestaurantRoutes } from "@/modules/restaurant/routes/admin.routes.js";
import { RestaurantOwnerRoutes } from "@/modules/restaurant/routes/owner.routes.js";
import { PublicRestaurantRoutes } from "@/modules/restaurant/routes/public.routes.js";
import { sendResponse } from "@/utils/sendResponse.js";
import Router, { Request, Response, NextFunction } from "express";

const router = Router();

router.use("/owner", RestaurantOwnerRoutes);

router.use("/admin/restaurants", AdminRestaurantRoutes);

router.use("/restaurants", PublicRestaurantRoutes);

router.use((req: Request, res: Response, next: NextFunction) => {
  sendResponse(res, 404, {
    success: false,
    message: `Cannot find ${req.method} ${req.originalUrl} on this server.`,
  });
});

export { router as Routes };
