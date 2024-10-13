import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const adminMiddleware = asyncHandler(async (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json(new ApiResponse(403, {}, "You are not authorized to perform this action"));
    }
    next();
})