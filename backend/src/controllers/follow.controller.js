import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Follow } from "../models/follow.model.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js"

const followUser = asyncHandler(async (req, res) => {
    const { followingToId } = req.params
    const user = await User.findById(req.user._id)
    const followingTo = await User.findById(followingToId)

    if (!followingTo) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    if (followingTo._id.toString() === user._id.toString()) {
        return res.status(400).json(new ApiResponse(400, {}, "You cannot follow yourself"))
    }

    const alreadyFollowing = await Follow.findOne({follower: user._id, following: followingTo._id})

    if (alreadyFollowing) {
        await Follow.findByIdAndDelete(alreadyFollowing._id)
        return res.status(200).json(
            new ApiResponse(200, {}, `You unfollowed ${followingTo.username} successfully`)
        )
    }

    await Follow.create({follower: user._id, following: followingTo._id})

    const follow = await Follow.findOne({follower: user._id, following: followingTo._id})

    if (!follow) {
        return res.status(404).json(new ApiResponse(404, {}, "Something went wrong while following user"))
    }

    return res.status(201).json(
        new ApiResponse(201, follow, `You followed ${followingTo.username} successfully`)
    )
})

const userFollowing = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

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

    if (!followingList.length) {
        return res.status(404).json(new ApiResponse(404, {}, "No following found"));
    }

    return res.status(200).json(
        new ApiResponse(200, followingList, "Following fetched successfully")
    );
});



const userFollowers = asyncHandler(async (req, res) => {
    const { userId } = req.params

    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    const followers = await Follow.aggregate([
        {
             $match: {
                following : user._id
            }
        },
        {
            $project: {
                follower: 1,
                _id: 0
            }
        },
    ]);

    const followersList = followers.map(f => f.follower); 

    if (!followersList.length) {
        return res.status(404).json(new ApiResponse(404, {}, "No followers found"))
    }

    return res.status(200).json(
        new ApiResponse(200, followersList, "Followers fetched successfully")
    )
})

export { followUser, userFollowing, userFollowers }