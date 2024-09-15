import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const authMiddleware = asyncHandler(async (req, _, next) => {
    try {
        if (!req.cookies.accessToken) {
            throw new ApiError(404, "token not found");
        }
        const token = req.cookies.accessToken || req.header("Authorization").replace("Bearer ", "");
    
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }
    
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new ApiError(401, "invalid token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error.message || "invalid token");
    }
})