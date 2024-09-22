import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { followUser, userFollowing, userFollowers } from "../controllers/follow.controller.js";


const router = Router();

// public routes
router.get("/following/:userId", authMiddleware, userFollowing);

router.get("/followers/:userId", authMiddleware, userFollowers);

// secure routes
router.post("/:followingToId", authMiddleware, followUser);


export default router