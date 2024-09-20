import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
    {
        comment: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment

