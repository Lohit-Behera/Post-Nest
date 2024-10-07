import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

const tokenSchema = new Schema(
    {
        token: {
            type: String,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

tokenSchema.methods.generateVerifyEmailToken = function () {
    const verifyEmailToken = crypto
        .randomBytes(32)
        .toString("hex");
    return verifyEmailToken;
}

tokenSchema.methods.generateForgotPasswordToken = function () {
    const forgotPasswordToken = crypto
        .randomBytes(32)
        .toString("hex");
    return forgotPasswordToken;
}

export const Token = mongoose.model("Token", tokenSchema)