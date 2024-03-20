import { Response } from "express";
import { redis } from "../utils/redis";

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