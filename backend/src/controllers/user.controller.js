import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Token } from "../models/token.model.js";
import { deleteFile, uploadFile } from "../utils/cloudinary.js";
import { sendEmail } from "../utils/sendMail.js";

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
                new ApiResponse(404, {}, "user not found")
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

// send verify email
const sendVerifyEmail = async (req, res) => {
    const userId = req.user._id

    if (req.user.isVerified) {
        return res.status(400).json(new ApiResponse(400, {}, "Email already verified"))
    }

    const token = await Token.findOne({ user: userId })

    if (!token) {
        await Token.create({ user: userId })
    }

    const verificationToken = await Token.findOne({ user: userId })

    if (!verificationToken) {
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while generating verification token"))
    }

    const emailVerifyToken = verificationToken.generateVerifyEmailToken()

    if (!emailVerifyToken) {
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while generating email verification token"))
    }

    verificationToken.token = emailVerifyToken
    await verificationToken.save({ validateBeforeSave: false })

    const verifyEmailLink = `${req.protocol + '://' + req.get('host')}/api/v1/users/verify-email/${userId}/${emailVerifyToken}`

    await sendEmail(req.user.email, "Verify Email", `Click on the link below to verify your email\n\n${verifyEmailLink}`);

    return res.status(200).json(new ApiResponse(200, {}, "Email verification link sent"))
}


// verify email
const verifyEmail = async (req, res) => {
    const { userId, token } = req.params
    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    const verifyEmailToken = await Token.findOne({ user: userId })

    if (!verifyEmailToken) {
        return res.status(404).json(new ApiResponse(404, {}, "Verification token not found"))
    }

    if (verifyEmailToken.token !== token) {
        return res.status(401).json(new ApiResponse(401, {}, "Invalid verification token"))
    }

    if (verifyEmailToken.token.toString() !== token.toString()) {
        return res.status(401).json(new ApiResponse(401, {}, "Invalid user"))
    }

    user.isVerified = true
    await user.save({ validateBeforeSave: false })

    await verifyEmailToken.deleteOne({ user: userId })

    return res.redirect(`http://localhost:5173?verified=true`)
}

const getUserDetails = async (req, res) => {
    const { id } = req.params

    const user = await User.findById(id).select("-password -refreshToken")

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User details fetched successfully")
    )
}

// update user details
const updateUserDetails = async (req, res) => {
    const user = await User.findById(req.user._id)
    const { fullName, bio, website} = req.body
    const avatarLocalPath = req.files.avatar ? req.files.avatar[0].path : null
    const coverImageLocalPath = req.files.coverImage ? req.files.coverImage[0].path : null

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    if (fullName === "" && bio === "" && website === "" && avatarLocalPath === null && coverImageLocalPath === null) {
        return res.status(400).json(new ApiResponse(400, {}, "Nothing to update"))
    }

    if (fullName !== "") {
        if (fullName === user.fullName) {
            return res.status(400).json(new ApiResponse(400, {}, "Full name is same as before"))
        } else if (fullName.length < 2) {
            return res.status(400).json(new ApiResponse(400, {}, "Full name should be atleast 2 characters long"))
        } else {
            user.fullName = fullName
        }
    }

    if (bio !== "") {
        if (bio === user.bio) {
            return res.status(400).json(new ApiResponse(400, {}, "Bio is same as before"))
        } else if (bio.length < 2) {
            return res.status(400).json(new ApiResponse(400, {}, "Bio should be atleast 2 characters long"))
        } else {
            user.bio = bio
        }
    }

    if (website !== "") {
        if (website === user.website) {
            return res.status(400).json(new ApiResponse(400, {}, "Website is same as before"))
        } else if (website.length < 2) {
            return res.status(400).json(new ApiResponse(400, {}, "Website should be atleast 2 characters long"))
        } else {
            user.website = website
        }
    }

    if (avatarLocalPath) {
        const avatarUrl = await uploadFile(avatarLocalPath)

        if (!avatarUrl) {
            return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while uploading avatar"))
        }

        const publicId = user.avatar.split('/').pop().split('.')[0];

        await deleteFile(publicId, res)

        user.avatar = avatarUrl
    }

    if (coverImageLocalPath) {
        if (user.coverImage) {
            const publicId = user.coverImage.split('/').pop().split('.')[0];
            await deleteFile(publicId, res)
        }
        
        const coverImageUrl = await uploadFile(coverImageLocalPath)
        
        if (!coverImageUrl) {
            return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while uploading cover image"))
        }
        user.coverImage = coverImageUrl
    }

    await user.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, {}, "User details updated successfully")
    )
}


export {
    registerUser,
    loginUser,
    logoutUser,
    userDetails,
    sendVerifyEmail,
    verifyEmail,
    getUserDetails,
    updateUserDetails
}