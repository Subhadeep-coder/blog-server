import { Request, response, Response } from "express";
import { setToken } from "../utils/jwt";
import UserModel from "../models/user.model";
import bcrypt from 'bcrypt';
import UserService from "../services/user.service";

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
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                message: `No User exists`
            })
        }

        return res.status(200).json({
            message: `User fetched`,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error`,
            error,
        });
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;
        const user = await UserService.getUserByUsername(username);
        return res.status(200).json({
            message: `User Fetched`,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error`,
            error,
        });
    }
}

export const updateUsername = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;
        const user = req.user;
        if (!username) {
            return res.status(403).json({ message: `Username must be provided to update` });
        }
        let oldUsername = user?.username;
        if (oldUsername === username) {
            return res.status(403).json({ message: `Same username` });
        }
        const existsUser = await UserService.getUserByUsername(username);
        if (existsUser) {
            return res.status(400).json({ message: `User exists already with this username` });
        }

        const updatedUser = await UserService.updateUsername({ id: user?.id, username });

        return res.status(200).json({ message: `Username updated` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error`,
            error,
        });
    }
}

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword && !newPassword) {
            return res.status(403).json({ message: `Password must be provided` });
        }
        const user = req?.user;
        if (oldPassword === newPassword) {
            return res.status(403).json({ message: `Password need to be changed` });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);
        const updatedUser = await UserService.updatePassword({ id: user?.id, password: hashedPassword });

        return res.status(200).json({
            message: `Password updated`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error`,
            error,
        });
    }
}

export const searchUsers = async (req: Request, res: Response) => {
    try {
        let { query } = req.body;

        const users = await UserService.findUsers({ username: new RegExp(query, "i") });

        return res.status(200).json({
            message: `Users fetched`,
            users
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error`,
            error,
        });
    }
}

export const updateRole = async (req: Request, res: Response) => {
    try {
        const { username, role }: { role: string, username: string } = req.body;
        if (!username) {
            return res.status(403).json({ message: `Username must be provided` });
        }

        const updatedUser = await UserService.updateRole({ username, role });
        return res.status(200).json({ message: `User updated` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error`,
            error,
        });
    }
}