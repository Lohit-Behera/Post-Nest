import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { makeUserAdmin, adminDashboard, getAllUsers, deleteUser, getAllPosts, deletePost } from "../controllers/admin.controller.js";

const router = Router();

// Admin routes
router.route("/make/:userId").patch(authMiddleware, adminMiddleware, makeUserAdmin)

router.route("/dashboard").get(authMiddleware, adminMiddleware, adminDashboard)

router.route("/users").get(authMiddleware, adminMiddleware, getAllUsers)

router.route("/delete/user/:userId").delete(authMiddleware, adminMiddleware, deleteUser)

router.route("/posts").get(authMiddleware, adminMiddleware, getAllPosts)

router.route("/delete/post/:postId").delete(authMiddleware, adminMiddleware, deletePost)


export default router