import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const supportSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Resolved"],
            default: "Pending"
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
        
    },
    {
        timestamps: true
    }
);

supportSchema.plugin(mongooseAggregatePaginate);

const Support = mongoose.model("Support", supportSchema);

export { Support }