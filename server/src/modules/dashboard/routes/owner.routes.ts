import { Router } from "express";

import { getOwnerDashboard } from "../controllers/owner.controller.js";

const router = Router();

router.get("/", getOwnerDashboard);

export { router as OwnerDashboardRoutes };
