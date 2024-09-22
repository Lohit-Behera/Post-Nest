import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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

export { Follow }