import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadFile } from "../utils/cloudinary.js";

const options = {
    httpOnly: true,
    secure: true,
}

// generate access token and refresh token
const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.log("Error details:", error);
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};


// Register user
const registerUser = asyncHandler(async (req, res) => {
    // get data from request
    const { username, email, fullName, password } = req.body

    // validate data
    if (!username || !email || !fullName || !password) {
        throw new ApiError(400, "Please provide all fields")
    }

    // check if user already exists
    if (await User.findOne({ $or: [{ username }, { email }] })) {
        throw new ApiError(409, "User with this email already exists")
    }
    
    // check for images
    const avatarLocalPath = req.files?.avatar[0]?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Please provide an avatar")
    }
    
    // upload images
    const avatarURL = await uploadFile(avatarLocalPath)
    if (!avatarURL) {
        throw new ApiError(500, "Something went wrong while uploading avatar")
    }

    // create user
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatarURL
    })

    // check for error in creating user
    const userDetails = await User.findById(user._id).select("-password -refreshToken -coverImage -bio -website -plan ")

    if (!userDetails) {
        throw new ApiError(500, "Something went wrong while creating user")
    }

    // send response
    return res.status(201).json(
        new ApiResponse(201, userDetails, "User created successfully")
    )
})

// Login user
const loginUser = asyncHandler(async (req, res) => {
    // get data from request
    const { username, email, password } = req.body

    // validate data
    if (!(username || email) || !password) {
        throw new ApiError(400, "Please provide all fields")
    }

    // check if user exists
    const user = await User.findOne({ $or: [{ username }, { email }] })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // check if password is correct
    if (!await user.comparePassword(password)) {
        throw new ApiError(401, "Invalid credentials")
    }

    // generate access token and refresh token
    const { accessToken, refreshToken } = await generateTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -coverImage -bio -website -plan ")

    // send response
    return res.status(200)
    .cookie("accessToken", accessToken, options) 
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, loggedInUser, "Login successful")
    )
})

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,{
        $set: {
            refreshToken: null
        }
    }, {
        new: true
    })

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "Logout successful")
    )
})

// user Details
const userDetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // send response
    return res.status(200).json(
        new ApiResponse(200, user, "User details fetched successfully")
    )
})


export { registerUser, loginUser, logoutUser, userDetails }