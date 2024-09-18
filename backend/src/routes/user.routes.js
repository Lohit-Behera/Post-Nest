import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    userDetails,
    sendVerifyEmail,
    verifyEmail,
    getUserDetails,
    updateUserDetails
 } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// public routes
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
    ]),
    registerUser
);

router.route("/login").post(loginUser)

router.route("/verify-email/:userId/:token").get(verifyEmail)

router.route("/user-details/:id").get(getUserDetails)

// secure routes
router.route("/logout").post(authMiddleware, logoutUser)

router.route("/details").get(authMiddleware, userDetails)

router.route("/send-verify-email").post(authMiddleware, sendVerifyEmail)

router.route("/update").patch(
    authMiddleware,
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    updateUserDetails
)


export default router