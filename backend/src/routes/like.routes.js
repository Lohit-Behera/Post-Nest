import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { likeUnlike, postLikes } from "../controllers/like.controller.js";


const router = Router();

// public routes
router.get("/post/:postId", postLikes);

// secure routes
router.put("/", authMiddleware, likeUnlike);


export default router