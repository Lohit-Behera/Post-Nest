import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createPost, postDetails, UpdatePost, deletePost, allPosts, userAllPosts, followingPosts } from "../controllers/post.controller.js";
import { resizeImage } from "../middlewares/resize.middleware.js";

const router = Router();

// public routes
router.get("/details/:id", postDetails);

router.get("/user/all/:userId", userAllPosts);

// secure routes
router.post(
    "/create",
    authMiddleware,
    upload.single("thumbnail"),
    resizeImage,
    createPost
);

router.patch(
    "/update/:id",
    authMiddleware,
    upload.single("thumbnail"),
    resizeImage,
    UpdatePost
);

router.delete("/delete/:id", authMiddleware, deletePost);

router.get("/all", authMiddleware, allPosts);


router.get("/following/all", authMiddleware, followingPosts);

export default router;