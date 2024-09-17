import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadFile } from "../utils/cloudinary.js";

const options = {
    httpOnly: true,
    secure: false,
    sameSite: 'None'
};


// generate access token and refresh token
const generateTokens = async (userId, res) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(
                new ApiResponse(404, {}, "username or email not found")
            )
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        res.status(500).json(new ApiResponse(500, {}, "Something went wrong while generating tokens"));
    }
};


// Register user
const registerUser = asyncHandler(async (req, res) => {
    // get data from request
    const { username, email, fullName, password } = req.body

    // validate data
    if (!username || !email || !fullName || !password) {
        res.status(400).json(new ApiResponse(400, {}, "Please provide all fields"))
    }

    // check if user already exists
    if (await User.findOne({ $or: [{ username }, { email }] })) {
        res.status(409).json(new ApiResponse(409, {}, "User with this username or email already exists"))
    }
    
    // check for images
    const avatarLocalPath = req.files?.avatar[0]?.path
    if (!avatarLocalPath) {
        res.status(400).json(new ApiResponse(400, {}, "Please provide an avatar"))
    }
    
    // upload images
    const avatarURL = await uploadFile(avatarLocalPath)
    if (!avatarURL) {
        res.status(500).json(new ApiResponse(500, {}, "Something went wrong while uploading avatar"))
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
        res.status(500).json(new ApiResponse(500, {}, "Something went wrong while creating user"))
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
        return res.status(400).json(
            new ApiResponse(400, {}, "Please provide username or email and password")
        )
    }

    // check if user exists
    const user = await User.findOne({ $or: [{ username }, { email }] })

    if (!user) {
        return res.status(401).json(
            new ApiResponse(401, {}, "username or email not found")
        )
    }
    
    // check if password is correct
    if (!await user.comparePassword(password)) {
        return res.status(401).json(
            new ApiResponse(401, {}, "Incorrect password")
        )
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
        res.status(404).json(new ApiResponse(404, {}, "username or email not found"))
    }

    // send response
    return res.status(200).json(
        new ApiResponse(200, user, "User details fetched successfully")
    )
})


export { registerUser, loginUser, logoutUser, userDetails }