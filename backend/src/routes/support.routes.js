import { Router } from "express";
import { sendSupportEmail } from "../controllers/support.controller.js";

const router = Router();

router.route("/create").put(sendSupportEmail);

export default router
