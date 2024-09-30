import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { followUser, userFollowing, userFollowers, userFollowingListWithDetails,userFollowersListWithDetails } from "../controllers/follow.controller.js";


const router = Router();

// public routes
router.get("/following/:userId", userFollowing);

router.get("/followers/:userId", userFollowers);

router.get("/following/list/:userId", userFollowingListWithDetails);

router.get("/followers/list/:userId", userFollowersListWithDetails);

// secure routes
router.post("/:followingToId", authMiddleware, followUser);

export default router