import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        avatar: {
            type: String,
            required: true
        },
        coverImage: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        bio: {
            type: String
        },
        website: {
            type: String
        },
        plan: {
            type: String,
            enum: ["free", "pro"],
            default: "free"
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String
        },
    },
    {
        timestamps: true 
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id, username: this.username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id, username: this.username }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
};

export const User = mongoose.model("User", userSchema)