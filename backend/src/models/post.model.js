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
        isPublished: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

postSchema.plugin(mongooseAggregatePaginate);

export default mongoose.model("Post", postSchema)