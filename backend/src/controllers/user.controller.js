import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Token } from "../models/token.model.js";
import { deleteFile, uploadFile } from "../utils/cloudinary.js";
import { sendEmail } from "../utils/sendMail.js";
import { oAuth2Client } from "../utils/googleConfig.js";
import axios from "axios";
import { ForgotPasswordEmailTemplate } from "../utils/html/ForgotPassword.js";

const accessTokenOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000, 
};

const refreshTokenOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 60 * 24 * 60 * 60 * 1000,
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
    const avatarFile = req.file
    if (!avatarFile) {
        res.status(400).json(new ApiResponse(400, {}, "Please provide an avatar"))
    }
    
    // upload images
    const avatarURL = await uploadFile(avatarFile)
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
            new ApiResponse(401, {}, "Invalid credentials")
        )
    }
    
    // check if password is correct
    if (!await user.comparePassword(password)) {
        return res.status(401).json(
            new ApiResponse(401, {}, "Invalid credentials")
        )
    }

    // generate access token and refresh token
    const { accessToken, refreshToken } = await generateTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -coverImage -bio -website -plan ")

    // send response
    return res.status(200)
    .cookie("accessToken", accessToken, accessTokenOptions) 
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(
        new ApiResponse(200, loggedInUser, "Sign in successful")
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
    .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    })
    .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    })
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

    const aggregate = await User.aggregate([
        {
            $match: {
              _id: user._id,
            },
          },
          {
            $lookup: {
              from: "posts",
              localField: "_id",
              foreignField: "author",
              as: "posts",
            }
          },
          {
            $addFields: {
              totalPosts: {
                $size: "$posts"
              }
            }
          },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "following",
              as: "following"
            }
          },
          {
            $addFields: {
              totalFollowing: {
                $size: "$following"
              }
              }
          },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "follower",
              as: "followers"
            }
          },
          {
            $addFields: {
              totalFollowers: {
                $size: "$followers"
              }
            }
          },
          {
            $project: {
              refreshToken: 0,
              password: 0,
              posts: 0,
              followers: 0,
              following: 0
            }
          }
    ])
    
    // send response
    return res.status(200).json(
        new ApiResponse(200, aggregate[0], "User details fetched successfully")
    )
})

// send verify email
const sendVerifyEmail = asyncHandler(async (req, res) => {
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
})


// verify email
const verifyEmail = asyncHandler(async (req, res) => {
    const { userId, token } = req.params

    if (!userId || !token) {
        return res.status(400).json(new ApiResponse(400, {}, "Invalid verification link"))
    }

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
})

const getUserDetails = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.status(400).json(new ApiResponse(400, {}, "Invalid user id"))
    }

    const user = await User.findById(id).select("-password -refreshToken")

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    const aggregate = await User.aggregate([
      {
        $match: {
          _id: user._id,
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "author",
          as: "posts",
        }
      },
      {
        $addFields: {
          totalPosts: {
            $size: "$posts"
          }
        }
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "following",
          as: "following"
        }
      },
      {
        $addFields: {
          totalFollowers: {
            $size: "$following"
          }
          }
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "follower",
          as: "followers"
        }
      },
      {
        $addFields: {
          totalFollowing: {
            $size: "$followers"
          }
        }
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "user",
          as: "likes"
        }
      },
      {
        $addFields: {
          totalLikes: {
            $size: "$likes"
          }
        }
      },
      {
        $project: {
          refreshToken: 0,
          password: 0,
          posts: 0,
          followers: 0,
          following: 0,
          likes: 0
        }
      }
    ])

    if (!aggregate.length) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    return res.status(200).json(
        new ApiResponse(200, aggregate[0], "User details fetched successfully")
    )
})

// update user details
const updateUserDetails = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!userId) {
        return res.status(400).json(new ApiResponse(400, {}, "Invalid user id"))
    }

    if (userId !== req.user._id.toString()) {
        return res.status(403).json(new ApiResponse(403, {}, "You are not authorized to update this user"))
    }
    const user = await User.findById(req.user._id)
    const { fullName, bio, website} = req.body
    const avatarFile = req.files.avatar ? req.files.avatar[0] : null
    const coverImageFile = req.files.coverImage ? req.files.coverImage[0] : null

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    if (fullName === "" && bio === "" && website === "" && avatarFile === null && coverImageFile === null) {
        return res.status(400).json(new ApiResponse(400, {}, "Nothing to update"))
    }

    if (fullName !== "" && fullName !== user.fullName) {
        if (fullName.length < 2) {
            return res.status(400).json(new ApiResponse(400, {}, "Full name should be atleast 2 characters long"))
        } else {
            user.fullName = fullName
        }
    }

    if (bio !== "" && bio !== user.bio) {
        if (bio.length < 2) {
            return res.status(400).json(new ApiResponse(400, {}, "Bio should be atleast 2 characters long"))
        } else {
            user.bio = bio
        }
    }

    if (website !== "" && website !== user.website) {
        if (website.length < 2) {
            return res.status(400).json(new ApiResponse(400, {}, "Website should be atleast 2 characters long"))
        } else {
            user.website = website
        }
    }

    if (avatarFile) {
        const avatarUrl = await uploadFile(avatarFile)

        if (!avatarUrl) {
            return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while uploading avatar"))
        }
        if (user.avatar) {
            const publicId = user.avatar.split('/').pop().split('.')[0];
            await deleteFile(publicId, res)
        }
        user.avatar = avatarUrl
    }

    if (coverImageFile) {
        const coverImageUrl = await uploadFile(coverImageFile)
        
        if (!coverImageUrl) {
            return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while uploading cover image"))
        }
        if (user.coverImage) {
            const publicId = user.coverImage.split('/').pop().split('.')[0];
            await deleteFile(publicId, res)
        }
        user.coverImage = coverImageUrl
    }

    await user.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, {}, "User details updated successfully")
    )
})

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body

    if (!oldPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json(new ApiResponse(400, {}, "Please provide old password, new password and confirm new password"))
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json(new ApiResponse(400, {}, "New password and confirm new password don't match"))
    }

    const user = await User.findById(req.user._id)

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    if (!await user.comparePassword(oldPassword)) {
        return res.status(401).json(new ApiResponse(401, {}, "Incorrect old password"))
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"))
})

const generateUniqueUsername = async (givenName) => {
  let username = givenName.toLowerCase().replace(/\s+/g, ""); // Normalize the username
  let user = await User.findOne({ username });

  // Keep appending random string until a unique username is found
  while (user) {
      const randomStr = Math.random().toString(36).substring(2, 6); // Generate a random 4-character string
      username = `${givenName.toLowerCase().replace(/\s+/g, "")}${randomStr}`;
      user = await User.findOne({ username });
  }

  return username;
};

const googleAuth = asyncHandler(async (req, res) => {
    try {
        const { token } = req.query
    
        if (!token) {
            return res.status(400).json(new ApiResponse(400, {}, "Token is required"))
        }
        const googleRes = await oAuth2Client.getToken(token)
        oAuth2Client.setCredentials(googleRes.tokens)
        
        if (!googleRes.tokens.access_token) {
            return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while generating access token"))
        }
    
        const userRes =await axios.get(
          `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
        )
    
        if (!userRes.data) {
            return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while fetching user details"))
        }
    
        const { email, name, given_name, picture, email_verified } = userRes.data
    
        if (!email || !name || !given_name || !picture || !email_verified) {
            return res.status(404).json(new ApiResponse(404, {}, "Email, name, given name, picture are not found"))
        }
    
        const user = await User.findOne({ email })
    
        if (!user) {
          const uniqueUsername = await generateUniqueUsername(given_name);
    
            const user = await User.create({
                username: uniqueUsername,
                email,
                fullName: name,
                password: Math.random().toString(36).slice(-8),
                avatar: picture,
                isVerified: email_verified
            })
            const { accessToken, refreshToken } = await generateTokens(user._id)
    
            const loggedInUser = await User.findById(user._id).select("-password -coverImage -bio -website -plan ")
    
            // send response
            return res.status(200)
            .cookie("accessToken", accessToken, accessTokenOptions) 
            .cookie("refreshToken", refreshToken, refreshTokenOptions)
            .json(
                new ApiResponse(200, loggedInUser, "Sign up successful with google")
            )
        } else {
            const { accessToken, refreshToken } = await generateTokens(user._id)
            const loggedInUser = await User.findById(user._id).select("-password -coverImage -bio -website -plan ")
    
            // send response
            return res.status(200)
            .cookie("accessToken", accessToken, accessTokenOptions) 
            .cookie("refreshToken", refreshToken, refreshTokenOptions)
            .json(
                new ApiResponse(200, loggedInUser, "Sign in successful with google")
            )
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong"))
    }
})

const userSearch = asyncHandler(async (req, res) => {
    const { username } = req.body

    if (!username) {
        return res.status(400).json(new ApiResponse(400, {}, "Please provide username"))  
    }

    const user = await User.find({ username: { $regex: `^${username}`, $options: "i" } })
        .select("_id username fullName avatar")
        .limit(5);

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    res.status(200).json(new ApiResponse(200, user, "User details fetched successfully"))
})

const sendForgotPasswordMail = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).json(new ApiResponse(400, {}, "Please provide email"))
    }

    const user = await User.findOne({ email })

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    const token = await Token.findOne({ user: user._id })

    if (!token) {
        await Token.create({ user: user._id })
    }

    const forgotPasswordToken = await Token.findOne({ user: user._id })

    if (!forgotPasswordToken) {
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while generating forgot password token"))
    }

    const generateForgotPasswordToken = forgotPasswordToken.generateForgotPasswordToken()

    if (!generateForgotPasswordToken) {
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while generating email forgot password token"))
    }

    forgotPasswordToken.token = generateForgotPasswordToken

    await forgotPasswordToken.save({ validateBeforeSave: false })

    const forgotPasswordEmailLink = `${process.env.CORS_ORIGIN || "http://localhost:5173"}/forgot-password/${user._id}/${generateForgotPasswordToken}`

    await sendEmail(user.email, "Forgot Password", ForgotPasswordEmailTemplate(forgotPasswordEmailLink));

    return res.status(200).json(new ApiResponse(200, {}, "Forgot password link sent"))
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { userId, token } = req.params
    const { password, confirmPassword } = req.body

    if (!userId || !token) {
        return res.status(400).json(new ApiResponse(400, {}, "Please provide userId and token"))
    }

    if (!password || !confirmPassword) {
        return res.status(400).json(new ApiResponse(400, {}, "Please provide password and confirmPassword"))
    }

    if (password !== confirmPassword) {
        return res.status(400).json(new ApiResponse(400, {}, "Password and confirmPassword should be same"))
    }

    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    const forgotPasswordToken = await Token.findOne({ token: token })

    if (!forgotPasswordToken) {
        return res.status(404).json(new ApiResponse(404, {}, "Forgot password token not found"))
    }

    if (forgotPasswordToken.user.toString() !== user._id.toString()) {
        return res.status(401).json(new ApiResponse(401, {}, "Invalid user"))
    }

    user.password = password
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"))
})

const changeUsername = asyncHandler(async (req, res) => {
    const { username } = req.body

    if (!username) {
        return res.status(400).json(new ApiResponse(400, {}, "Please provide username"))
    }

    const user = await User.findById(req.user._id)

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    const existingUser = await User.findOne({ username })

    if (existingUser) {
        return res.status(409).json(new ApiResponse(409, {}, "User with this username already exists"))
    }

    user.username = username
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, {}, "Username changed successfully"))
})


export {
    registerUser,
    loginUser,
    logoutUser,
    userDetails,
    sendVerifyEmail,
    verifyEmail,
    getUserDetails,
    updateUserDetails,
    changePassword,
    googleAuth,
    userSearch,
    sendForgotPasswordMail,
    forgotPassword,
    changeUsername,
}