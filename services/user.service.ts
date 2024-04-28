import { Response } from "express";
import { redis } from "../utils/redis";
import UserModel from "../models/user.model";

interface CreateUserPayload {
    email: string;
    password: string;
    name: string;
    username: string;
    role: "ADMIN" | "MODERATOR" | "USER";
}

class UserService {
    public static async createUser(payload: CreateUserPayload) {
        return UserModel.create(payload);
    }

    public static async getUserByEmail({ email }: { email: string }) {
        return UserModel.findOne({ email });
    }

    public static async getUserById({ id }: { id: string }) {
        return UserModel.findById(id);
    }

    public static async getUserByUsername({ username }: { username: string }) {
        return UserModel.findOne({ username }).select("-password -refreshToken -updatedAt");
    }

    public static async updateUsername({ id, username }: { id: string, username: string }) {
        return UserModel.findByIdAndUpdate(id, {
            $set: { username: username }
        });
    }

    public static async updatePassword({ id, password }: { id: string, password: string }) {
        return UserModel.findByIdAndUpdate(id, {
            $set: {
                password: password
            }
        });

    }

    public static async updateRole({ username, role }: { username: string, role: string }) {
        return UserModel.findOneAndUpdate({ username: username }, {
            $set: {
                role: role.toUpperCase()
            }
        });
    }

    public static async findUsers({ username }: { username: RegExp }) {
        return UserModel.find({ username: username })
            .limit(50)
            .select("name username avatar -_id -refreshToken")
    }
}

export const getUserById = async (id: string) => {
    try {
        const userJson = await redis.get(id);
        if (userJson) {
            const user = JSON.parse(userJson);
            return user;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default UserService;