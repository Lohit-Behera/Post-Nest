import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createComment, getComments, deleteComment, updateComment } from "../controllers/comment.controller.js";

const router = Router();

// public routes
router.get("/:postId", getComments);


// secure routes
router.post("/create", authMiddleware, createComment);

router.delete("/delete/:commentId", authMiddleware, deleteComment);

router.patch("/update", authMiddleware, updateComment);


export default router