import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js"
import { Comment } from "../models/comment.model.js"
import mongoose from "mongoose";

const createComment = asyncHandler(async (req, res) => {
    const { postId, comment } = req.body;
    const userId = req.user._id;

    if (!comment) {
        return res.status(400).json(new ApiResponse(400, {}, "Please provide Comment"));
    }

    const post = await Post.findById(postId);

    if (!post) {
        return res.status(404).json(new ApiResponse(404, {}, "Post not found"));
    }

    const createComment = await Comment.create({
        user: userId,
        post: postId,
        comment: comment
    });

    const createdComment = await Comment.findById(createComment._id)

    if (!createdComment) {
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while creating comment"));
    }

    return res.status(201).json(
        new ApiResponse(201, createdComment, "Comment created successfully"
        ));
});

const getComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        return res.status(400).json(new ApiResponse(400, {}, "Please provide Post Id"));
    }

    const post = await Post.findById(postId);

    if (!post) {
        return res.status(404).json(new ApiResponse(404, {}, "Post not found"));
    }

    const aggregatePipeline = [
        {
          $match: {
            post: mongoose.Types.ObjectId.createFromHexString(postId)
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userInfo"
          }
        },
        {
          $unwind: "$userInfo"
        },
        {
          $project: {
            user: 1,
            comment: 1,
            post: 1,
            createdAt: 1,
            updatedAt: 1,
            username: "$userInfo.username",
            avatar: "$userInfo.avatar",
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        }
    ];

    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
    };

    const comments = await Comment.aggregatePaginate(Comment.aggregate(aggregatePipeline), options);

    if (!comments.docs.length) {
        return res.status(404).json(new ApiResponse(404, {}, "No comments found"));
    }

    return res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user._id

    const comment = await Comment.findById(commentId)

    if (!comment) {
        return res.status(404).json(new ApiResponse(404, {}, "Comment not found"))
    }

    if (comment.user.toString() !== userId.toString()) {
        return res.status(403).json(new ApiResponse(403, {}, "You are not authorized to delete this comment"))
    }

    await Comment.findByIdAndDelete(commentId)
    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { comment, commentId } = req.body

    const commentToUpdate = await Comment.findById(commentId)

    if (!commentToUpdate) {
        return res.status(404).json(new ApiResponse(404, {}, "Comment not found"))
    }

    if (commentToUpdate.user.toString() !== userId.toString()) {
        return res.status(403).json(new ApiResponse(403, {}, "You are not authorized to update this comment"))
    }

    if (!comment) {
        return res.status(400).json(new ApiResponse(400, {}, "Please provide a comment to update"))
    }

    commentToUpdate.comment = comment
    await commentToUpdate.save()

    return res.status(200).json(
        new ApiResponse(200, commentToUpdate, "Comment updated successfully")
    )
})

export { createComment, getComments, deleteComment, updateComment }