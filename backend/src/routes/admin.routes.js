import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { makeUserAdmin, adminDashboard, getAllUsers, getAllPosts } from "../controllers/admin.controller.js";

const router = Router();

// Admin routes
router.route("/make/:userId").patch(authMiddleware, adminMiddleware, makeUserAdmin)

router.route("/dashboard").get(authMiddleware, adminMiddleware, adminDashboard)

router.route("/users").get(authMiddleware, adminMiddleware, getAllUsers)

router.route("/posts").get(authMiddleware, adminMiddleware, getAllPosts)


export default router