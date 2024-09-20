import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        thumbnail: {
            type: String
        },
        isPublic: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
);

postSchema.plugin(mongooseAggregatePaginate);

const Post = mongoose.model("Post", postSchema);

export { Post }