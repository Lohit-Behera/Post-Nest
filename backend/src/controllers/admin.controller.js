import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { sendEmail } from "../utils/sendMail.js";

const makeUserAdmin = asyncHandler(async (req, res) => {
    // get user id from params
    const { userId } = req.params
    // check if user exists
    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }
    // check if user is admin
    if (user.isAdmin) {
        return res.status(400).json(new ApiResponse(400, {}, "User is already admin"))
    }
    // make user admin
    user.isAdmin = true
    await user.save({ validateBeforeSave: false })

    // send response
    return res.status(200).json(new ApiResponse(200, {}, "User made admin successfully"))
})

const adminDashboard = asyncHandler(async (req, res) => {
    // get users counts
    const usersCount = await User.countDocuments()
    // get posts counts
    const postsCount = await Post.countDocuments()
    // get comments counts
    const commentsCount = await Comment.countDocuments()
    // get like
    const likesCount = await Like.countDocuments()
    // get last 10 posts
    const posts = await Post.aggregate([
        {
            $sort: {
            createdAt: -1
            }
        },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: {
            path: "$user"
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            author: 1,
            username: "$user.username",
          }
        },
        {
          $limit: 10
        }
    ])
    // get last 10 users
    const users = await User.find().sort({ createdAt: -1 }).limit(10).select({ _id: 1, username: 1, fullName: 1, avatar: 1 })

    // send response
    return res.status(200).json(new ApiResponse(200, { usersCount, postsCount, commentsCount, likesCount, posts, users }, "Admin dashboard"))
})

export {
    makeUserAdmin,
    adminDashboard
}