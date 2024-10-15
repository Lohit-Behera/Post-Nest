import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { deleteFile } from "../utils/cloudinary.js";
import { Support } from "../models/support.model.js";
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
        user.isAdmin = false
        await user.save({ validateBeforeSave: false })
        return res.status(200).json(new ApiResponse(200, {}, `${user.fullName} removed from admin successfully`))
    }
    // make user admin
    user.isAdmin = true
    await user.save({ validateBeforeSave: false })

    // send response
    return res.status(200).json(new ApiResponse(200, {}, `${user.fullName} made admin successfully`))
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
    const support = await Support.find().sort({ createdAt: -1 }).select("name email subject status").limit(5)

    // send response
    return res.status(200).json(new ApiResponse(200, { usersCount, postsCount, commentsCount, likesCount, posts, support }, "Admin dashboard"))
})

const getAllUsers = asyncHandler(async (req, res) => {
    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 12,
    };
    const aggregate = User.aggregate([
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "following",
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
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "follower",
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
          from: "posts",
          localField: "_id",
          foreignField: "author",
          as: "posts"
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
        $project: {
          _id: 1,
          email: 1,
          fullName: 1,
          username: 1,
          totalFollowing: 1,
          totalFollowers: 1,
          isAdmin: 1,
          totalPosts: 1
        }
      },
      {
        $sort: {
          fullName: 1
        }
      }
    ])
    const users = await User.aggregatePaginate(aggregate, options)
    // send response
    return res.status(200).json(new ApiResponse(200, users, "All users"))
})

const deleteUser = asyncHandler(async (req, res) => {
    // get user id from params
    const { userId } = req.params
    // check if user exists
    const user = await User.findById(userId)
    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }
    // delete image from cloudinary
    if (user.avatar) {
        const publicId = user.avatar.split('/').pop().split('.')[0];
        await deleteFile(publicId, res)
    }
    if (user.coverImage) {
        const publicId = user.coverImage.split('/').pop().split('.')[0];
        await deleteFile(publicId, res)
    }
    // delete user
    await User.findByIdAndDelete(user._id)
    // send response
    return res.status(200).json(new ApiResponse(200, {}, `${user.fullName} deleted successfully`))
})

const getAllPosts = asyncHandler(async (req, res) => {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    };

    const aggregate = Post.aggregate([
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
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "post",
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
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments"
        }
      },
       {
        $addFields: {
          totalComments: {
            $size: "$comments"
          }
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          author: 1,
          username: "$user.username",
          totalComments: 1,
          totalLikes: 1
        }
      }
    ])
    const posts = await Post.aggregatePaginate(aggregate, options)
    // send response
    return res.status(200).json(new ApiResponse(200, posts, "All posts"))
})

const deletePost = asyncHandler(async (req, res) => {
    // get post id from params
    const { postId } = req.params
    // check if post exists
    const post = await Post.findById(postId)
    if (!post) {
        return res.status(404).json(new ApiResponse(404, {}, "Post not found"))
    }
    // delete image from cloudinary
    if (post.thumbnail) {
        const publicId = post.thumbnail.split('/').pop().split('.')[0];
        await deleteFile(publicId, res)
    }
    // delete post
    await Post.findByIdAndDelete(post._id)
    // send response
    return res.status(200).json(new ApiResponse(200, {}, `${post.title} deleted successfully`))
})

const getAllSupports = asyncHandler(async (req, res) => {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    };
    // get all supports
    const aggregate = Support.aggregate([
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          subject: 1,
          status: 1
        }
      }
    ])
    // paginate supports
    const supports = await Support.aggregatePaginate(aggregate, options)
    // send response
    return res.status(200).json(new ApiResponse(200, supports, "All supports"))
})

const supportDetails = asyncHandler(async (req, res) => {
    // get support id from params
    const { supportId } = req.params
    // check if support ticket exists
    const support = await Support.findById(supportId)
    let post;
    let user;
    
    if (!support) {
        return res.status(404).json(new ApiResponse(404, {}, "Support ticket not found"))
    }
    if (support.post) {
        post = await Post.findById(support.post).select("title thumbnail author createdAt")
    }
    if (support.user) {
        user = await User.findById(support.user).select("avatar username fullName email isAdmin isVerified createdAt") 
    }

    // send response
    return res.status(200).json(new ApiResponse(200, { support, post, user }, "Fetched Support ticket"))
})

const changeSupportStatus = asyncHandler(async (req, res) => {
    // get support id from params
    const { supportId, status } = req.body
    // check if support ticket exists
    const support = await Support.findById(supportId)
    if (!support) {
        return res.status(404).json(new ApiResponse(404, {}, "Support ticket not found"))
    }
    // change support status
    support.status = status
    await support.save({ validateBeforeSave: false })
    // send response
    return res.status(200).json(new ApiResponse(200, {}, "Support ticket status changed successfully"))
})

export {
    makeUserAdmin,
    adminDashboard,
    getAllUsers,
    getAllPosts,
    deleteUser,
    deletePost,
    getAllSupports,
    supportDetails,
    changeSupportStatus
}