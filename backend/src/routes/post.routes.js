import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createPost, postDetails } from "../controllers/post.controller.js";

const router = Router();

// public routes
router.get("/details/:id", authMiddleware, postDetails);

// secure routes
router.post(
    "/create",
    authMiddleware,
    upload.single("thumbnail"),
    createPost
);

export default router;