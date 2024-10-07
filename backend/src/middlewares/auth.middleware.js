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
      res.status(401).json(new ApiResponse(401, err.message, "invalid token"));
      return true;
    }
  }

export const authMiddleware = asyncHandler(async (req, res, next) => {
    try {
        console.log(req.cookies);
        
        let token = req.cookies.accessToken || "";

        if (!req.cookies.accessToken){
            const refreshToken = JSON.parse(req.cookies.userInfoPostNest).refreshToken;

            if (!refreshToken) {
                res.status(401).json(new ApiResponse(401, {}, "Unauthorized"));
            }
            const isRefreshTokenExpired = isTokenExpired(refreshToken, res);

            if (isRefreshTokenExpired) {
                res.status(401).json(new ApiResponse(401, {}, "Refresh token expired"));
            }

            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            const user = await User.findById(decoded.id);

            if (!user) {
                res.status(401).json(new ApiResponse(401, {}, "invalid token"));
            }

            const newAccessToken = user.generateAccessToken();

            const newRefreshToken = user.generateRefreshToken();

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true, 
                secure: false,
                sameSite: 'None'
            });

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true, 
                secure: false,
                sameSite: 'None'
            });
            token = newAccessToken;
        }
    
        if (!token) {
            res.status(401).json(new ApiResponse(401, {}, "Unauthorized"));
        }
    
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(401).json(new ApiResponse(401, {}, "invalid token user not found"));
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json(new ApiResponse(401, error.message, "invalid token auth middleware"));
    }
})