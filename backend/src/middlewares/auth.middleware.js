import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


function isTokenExpired(token, res) {
    try {
        const decoded = jwt.decode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
        
    } catch (err) {
        return res.status(401).json(new ApiResponse(401, err.message, "invalid token"));
    }
}

export const authMiddleware = asyncHandler(async (req, res, next) => {
    try {
        let token = req.cookies.accessToken || "";
        
        const isAccessTokenExpired = isTokenExpired(token, res);

        if (!req.cookies.accessToken || isAccessTokenExpired) {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json(new ApiResponse(401, {}, "Unauthorized"));
            }

            const isRefreshTokenExpired = isTokenExpired(refreshToken, res);
            if (isRefreshTokenExpired) {
                return res.status(401).json(new ApiResponse(401, {}, "Refresh token expired"));
            }

            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json(new ApiResponse(401, {}, "invalid token"));
            }

            const newAccessToken = user.generateAccessToken();
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
            });
            token = newAccessToken;
        }

        if (!token) {
            return res.status(401).json(new ApiResponse(401, {}, "Unauthorized"));
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json(new ApiResponse(401, {}, "invalid token user not found"));
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json(new ApiResponse(401, error.message, "invalid token auth middleware"));
    }
});
