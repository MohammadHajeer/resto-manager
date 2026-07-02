import { RestaurantOwnerRoutes } from "@/modules/restaurant/routes/owner.routes.js";
import { sendResponse } from "@/utils/sendResponse.js";
import Router, { Request, Response, NextFunction } from "express";

const router = Router();

router.use("/owner", RestaurantOwnerRoutes);

router.use((req: Request, res: Response, next: NextFunction) => {
  sendResponse(res, 404, {
    success: false,
    message: `Cannot find ${req.method} ${req.originalUrl} on this server.`,
  });
});

export { router as Routes };
