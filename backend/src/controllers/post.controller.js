import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js"
import { deleteFile, uploadFile } from "../utils/cloudinary.js";

const createPost = asyncHandler(async (req, res) => {
    // get user from req
    const userReq = req.user

    // get data from req body
    const { title, content, isPublic } = req.body

    // validate data
    if (!title || !content) {
        return res.status(400).json(
            new ApiResponse(400, "Title and content are required")
        )
    }

    // get thumbnail form file
    const thumbnailLocalPath = req.file?.path
    
    
    // validate thumbnail
    if (!thumbnailLocalPath) {
        return res.status(400).json(
            new ApiResponse(400, "Please provide an thumbnail")
        )
    }

    // upload thumbnail to cloudinary
    const thumbnailUrl = await uploadFile(thumbnailLocalPath)

    // check thumbnail is uploaded
    if (!thumbnailUrl) {
        res.status(500).json(new ApiResponse(500, {}, "Something went wrong while uploading thumbnail"))
    }

    // save data to database
    const post = await Post.create({
        title: title,
        content: content,
        author: userReq._id,
        thumbnail: thumbnailUrl,
        isPublic: isPublic || true,
    })

    // validate that data save to database
    if (!post) {
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while creating post"))
    }

    const postDetails = await Post.findOne({ _id: post._id })

    if (!postDetails) {
        return res.status(404).json(new ApiResponse(404, {}, "Something went wrong while creating post"))
    }
    // send response
    return res.status(201).json(
        new ApiResponse(201, postDetails, "Post created successfully")
    )
})

const postDetails = asyncHandler(async (req, res) => {
    const { id } = req.params

    const post = await Post.findById(id)

    if (!post) {
        return res.status(404).json(new ApiResponse(404, {}, "Post not found"))
    }

    const userDetails = await User.findById(post.author).select("-password -refreshToken -bio -website -createdAt -updatedAt -plan -isAdmin -isVerified -coverImage -__v")

    if (!userDetails) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    return res.status(200).json(
        new ApiResponse(200, {post: post, user: userDetails}, "Post details fetched successfully")
    )
})

export { createPost, postDetails }