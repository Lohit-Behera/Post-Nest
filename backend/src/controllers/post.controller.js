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

const UpdatePost = asyncHandler(async (req, res) => {
    const { id } = req.params
    const userId = req.user._id
    const { title, content, isPublic } = req.body

    const post = await Post.findById(id)

    if (!post) {
        return res.status(404).json(new ApiResponse(404, {}, "Post not found"))
    }

    if (post.author.toString() !== userId.toString()) {
        return res.status(403).json(new ApiResponse(403, {}, "You are not authorized to update this post"))
    }

    if (!title && !content && !isPublic) {
        return res.status(400).json(new ApiResponse(400, {}, "Please provide at least one field to update"))
    }

    if (post.title === title && post.content === content && post.isPublic === isPublic && !req.file) {
            return res.status(400).json(new ApiResponse(400, {}, "No changes detected"))
        }

    if (title) {
        post.title = title
    }
    if (content) {
        post.content = content
    }
    if (isPublic) {
        post.isPublic = isPublic
    }

    if (req.file) {
        const thumbnailLocalPath = req.file?.path
        const thumbnailUrl = await uploadFile(thumbnailLocalPath)
        
        if (!thumbnailUrl) {
            return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while uploading thumbnail"))
        }
        const publicId = post.thumbnail.split('/').pop().split('.')[0]
        await deleteFile(publicId, res)
        console.log(publicId);
        await Post.findByIdAndUpdate(id, {
            thumbnail: thumbnailUrl
        })
    }

    await post.save({ validateBeforeSave: false })

    const updatedPost = await Post.findById(id)

    if (!updatedPost) {
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while updating post"))
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Post updated successfully")
    )
})

const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params
    const userId = req.user._id

    const post = await Post.findById(id)

    if (!post) {
        return res.status(404).json(new ApiResponse(404, {}, "Post not found"))
    }

    if (post.author.toString() !== userId.toString()) {
        return res.status(403).json(new ApiResponse(403, {}, "You are not authorized to delete this post"))
    }

    const publicId = post.thumbnail.split('/').pop().split('.')[0];

    await deleteFile(publicId, res)
    await Post.findByIdAndDelete(id)
    return res.status(200).json(
        new ApiResponse(200, {}, "Post deleted successfully")
    )
})

const allPosts = asyncHandler(async (req, res) => {
    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
    };

    const aggregate = Post.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorDetails",
            },
        },
        {
            $unwind: "$authorDetails",
        },
        {
            $project: {
                title: 1,
                content: 1,
                thumbnail: 1,
                isPublic: 1,
                createdAt: 1,
                updatedAt: 1,
                "authorDetails.username": 1,
                "authorDetails.fullName": 1,
                "authorDetails._id": 1,
                "authorDetails.avatar": 1,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
    ]);

    const posts = await Post.aggregatePaginate(aggregate, options);

    if (!posts) {
        return res.status(404).json(new ApiResponse(404, {}, "No posts found"));
    }

    return res.status(200).json(
        new ApiResponse(200, posts, "Posts fetched successfully")
    );
});

const userAllPosts = asyncHandler(async  (req, res) => {
    const { userId } = req.params
    const user = await User.findById(userId)

    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
    };

    const aggregateQuery = Post.aggregate([
        { $match: { author: user._id } },
        { $sort: { createdAt: -1 } }, 
    ]);

    const posts = await Post.aggregatePaginate(aggregateQuery, options);

    if (!posts.docs.length) {
        return res.status(404).json(new ApiResponse(404, {}, "No posts found"));
    }

    return res.status(200).json(
        new ApiResponse(200, posts, "User posts fetched successfully")
    )
})

export { createPost, postDetails, UpdatePost, deletePost, allPosts, userAllPosts }