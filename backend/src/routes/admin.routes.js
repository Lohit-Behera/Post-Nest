import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { makeUserAdmin, adminDashboard } from "../controllers/admin.controller.js";

const router = Router();

// Admin routes
router.route("/make-admin/:userId").patch(authMiddleware, adminMiddleware, makeUserAdmin)

router.route("/dashboard").get(authMiddleware, adminMiddleware, adminDashboard)


export default router