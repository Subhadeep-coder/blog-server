import { Request, Response } from "express";
import { getUserById } from "../services/user.service";
import { sendToken } from "../utils/jwt";

export const getAllUsers = (req: Request, res: Response) => {
    try {

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error`,
            error,
        });
    }
}

export const getSelf = async (req: Request, res: Response) => {
    try {
        const userId = req?.user?._id;
        const user = await getUserById(userId);
        if (!user) {
            return res.status(400).json({
                message: `No User exists`
            })
        }

        sendToken(user, 200, res);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error`,
            error,
        });
    }
}