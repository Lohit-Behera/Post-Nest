import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization").replace("Bearer ", "");
    
        if (!token) {
            res.status(401).json(new ApiResponse(401, {}, "Unauthorized"));
        }
    
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(401).json(new ApiResponse(401, {}, "invalid token"));
        }
    
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json(new ApiResponse(401, error.message, "invalid token"));
    }
})