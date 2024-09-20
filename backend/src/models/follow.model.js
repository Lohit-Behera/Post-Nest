import mongoose, { Schema } from "mongoose";

const followSchema = new Schema(
    {
        following: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        follower: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
);

followSchema.plugin(mongooseAggregatePaginate);

const Follow = mongoose.model("Follow", followSchema);

export default Follow