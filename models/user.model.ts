import mongoose, { Document, Model, Schema } from "mongoose";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    };
    refreshToken: string;
    role: "ADMIN" | "MODERATOR" | "USER";
    dob: Date;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
};

const UserSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value: string) => {
                return emailRegexPattern.test(value)
            },
            message: `Please enter a valid email`
        }
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        public_id: String,
        url: String,
    },
    refreshToken: {
        type: String,
    },
    role: {
        type: String,
        enum: ["ADMIN", "MODERATOR", "USER"],
        default: "USER",
    },
    dob: {
        type: Date,
    }
}, { timestamps: true });

UserSchema.methods.SignAccessToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.REFRESH_TOKEN || "" as string,
        { expiresIn: '10m' }
    )
}
UserSchema.methods.SignRefreshToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.REFRESH_TOKEN || "" as string,
        { expiresIn: '7d' }
    )
}

const UserModel: Model<IUser> = mongoose.model("user", UserSchema);

export default UserModel;