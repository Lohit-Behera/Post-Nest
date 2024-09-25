import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js"
import { Comment } from "../models/comment.model.js"
import mongoose from "mongoose";


const likeUnlike = asyncHandler(async (req, res) => {
    const { postId, commentId } = req.body;
    const userId = req.user._id;

    if (postId) {
        
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json(new ApiResponse(404, {}, "Post not found"));
        }
        
        const like = await Like.findOne({
            user: userId,
            post: post._id
        });

        if (like) {
            await Like.deleteOne({ _id: like._id });
            return res.status(200).json(
                new ApiResponse(200, {}, "Post unliked successfully")
            )
        }
        

        const createLike = await Like.create({
            user: userId,
            post: postId
        });

        const createdLike = await Like.findById(createLike._id)

        if (!createdLike) {
            return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while liking post"));
        }

        return res.status(200).json(
            new ApiResponse(200, {}, "Post liked successfully")
        )
    }

    if (commentId) {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json(new ApiResponse(404, {}, "Comment not found"));
        }

        const like = await Like.findOne({
            user: userId,
            comment: commentId
        });

        if (Like){
            await Like.deleteOne({ _id: like._id });
            return res.status(200).json(
                new ApiResponse(200, {}, "Comment unliked successfully")
            )
        }

        const createLike = await Like.create({
            user: userId,
            comment: commentId
        });

        const createdLike = await Like.findById(createLike._id)

        if (!createdLike) {
            return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while liking comment"));
        }

        return res.status(200).json(
            new ApiResponse(200, {}, "Comment liked successfully")
        )
    }
})

const postLikes = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!postId) {
        return res.status(400).json(new ApiResponse(400, {}, "Please provide Post Id"));
    }

    const post = await Post.findById(postId);

    if (!post) {
        return res.status(404).json(new ApiResponse(404, {}, "Post not found"));
    }

    const likes = await Like.find({ post: postId })
    const userList = likes.map((like) => like.user);

    return res.status(200).json(
        new ApiResponse(200, userList, "Likes fetched successfully")
    )
})

export { likeUnlike, postLikes }