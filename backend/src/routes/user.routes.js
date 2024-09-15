import { Router } from "express";
import { registerUser, loginUser, logoutUser, userDetails } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
    ]),
    registerUser
);

router.route("/login").post(loginUser)

// secure routes
router.route("/logout").post(authMiddleware, logoutUser)

router.route("/details").get(authMiddleware, userDetails)

export default router