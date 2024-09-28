import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js"
import { Follow } from "../models/follow.model.js";
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

    if (!id) {
        return res.status(400).json(new ApiResponse(400, {}, "Post id is required"))
    }

    const post = await Post.aggregate([
            {
              $match: {
                _id: mongoose.Types.ObjectId.createFromHexString(id)
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
              $unwind: "$user"
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
                },
                totalComments: {
                  $size: "$comments"
                }
              }
            },
            {
              $project: {
                title: 1,
                content: 1,
                isPublic: 1,
                createdAt: 1,
                updatedAt: 1,
                author: 1,
                thumbnail: 1,
                totalLikes: 1,
                totalComments: 1,
                username: "$user.username",
                fullName: "$user.fullName",
                avatar: "$user.avatar"
              }
            }
    ])

    if (!post) {
        return res.status(404).json(new ApiResponse(404, {}, "Post not found"))
    }

    return res.status(200).json(
        new ApiResponse(200, post[0], "Post details fetched successfully")
    )
})

const UpdatePost = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.status(400).json(new ApiResponse(400, {}, "Post id is required"))
    }

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

    if (!id) {
        return res.status(400).json(new ApiResponse(400, {}, "Post id is required"))
    }
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
        limit: parseInt(req.query.limit) || 12,
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
                author: 1,
                title: 1,
                content: 1,
                thumbnail: 1,
                isPublic: 1,
                createdAt: 1,
                updatedAt: 1,
                username: "$authorDetails.username",
                fullName: "$authorDetails.fullName",
                avatar: "$authorDetails.avatar",
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
    if (!userId) {
        return res.status(400).json(new ApiResponse(400, {}, "User id is required"))
    }
    const user = await User.findById(userId)

    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 12,
    };

    const aggregateQuery = Post.aggregate([
        {
            $match: {
              author: user._id
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
            $unwind: "$user"
          },
          {
            $project: {
                title: 1,
              author: 1,
              thumbnail: 1,
              content: 1,
              isPublic: 1,
              createdAt: 1,
              updatedAt: 1,
              username: "$user.username",
              fullName: "$user.fullName",
              avatar: "$user.avatar"
            }
          },
          {
            $sort: {
              createdAt: -1
            }
          }
    ]);

    const posts = await Post.aggregatePaginate(aggregateQuery, options);

    if (!posts.docs.length) {
        return res.status(200).json(new ApiResponse(200, {}, "No posts found"));
    }

    return res.status(200).json(
        new ApiResponse(200, posts, "User posts fetched successfully")
    )
})

const followingPosts = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 12,
    };

    const following = await Follow.aggregate([
        {
            $match: {
                follower: user._id
            }
        },
        {
            $project: {
                following: 1,
                _id: 0
            }
        }
    ]);

    const followingList = following.map(f => f.following);

    // Aggregation query to fetch posts
    const aggregateQuery = await Post.aggregate([
        {
            $match: {
                author: {
                    $in: followingList
                }
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
            $unwind: "$user"
        },
        {
            $project: {
                username: "$user.username",
                fullName: "$user.fullName",
                avatar: "$user.avatar",
                author: 1,
                title: 1,
                content: 1,
                thumbnail: 1,
                isPublic: 1,
                createdAt: 1,
                updatedAt: 1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: (options.page - 1) * options.limit
        },
        {
            $limit: options.limit
        }
    ]);

    // Count total documents
    const totalPosts = await Post.countDocuments({
        author: { $in: followingList },
    });

    // Calculate pagination
    const totalPages = Math.ceil(totalPosts / options.limit);
    const hasPrevPage = options.page > 1;
    const hasNextPage = options.page < totalPages;
    const pagingCounter = (options.page - 1) * options.limit + 1;
    
    return res.status(200).json(
        new ApiResponse(200, {
            docs: aggregateQuery,
            totalDocs: totalPosts,
            limit: options.limit,
            page: options.page,
            totalPages: totalPages,
            pagingCounter: pagingCounter,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevPage: hasPrevPage ? options.page - 1 : null,
            nextPage: hasNextPage ? options.page + 1 : null,
        }, "Posts fetched successfully")
    );
});

export { createPost, postDetails, UpdatePost, deletePost, allPosts, userAllPosts, followingPosts }