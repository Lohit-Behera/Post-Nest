import { Router } from "express";
import { registerUser, loginUser, logoutUser, userDetails, sendVerifyEmail, verifyEmail } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
    ]),
    registerUser
);


// public routes
router.route("/login").post(loginUser)

router.route("/verify-email/:userId/:token").get(verifyEmail)

// secure routes
router.route("/logout").post(authMiddleware, logoutUser)

router.route("/details").get(authMiddleware, userDetails)

router.route("/send-verify-email").post(authMiddleware, sendVerifyEmail)


export default router