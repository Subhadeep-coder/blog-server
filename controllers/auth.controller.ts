import { Request, Response } from "express";
import UserModel, { IUser } from "../models/user.model";
import { generateUsername } from "../utils/generate-username";
import bcrypt from 'bcrypt';
import { emailQueue } from "../utils/queues";
import { generateActivationCode, verifyCode } from "../utils/generate-code";
import { JwtPayload } from "jsonwebtoken";
import { sendMail } from "../utils/sendMail";
import { accessTokenOptions, refreshTokenOptions, setToken, verifyCode as verifyRefreshToken } from "../utils/jwt";
import dotenv from 'dotenv';
import { redis } from "../utils/redis";
dotenv.config();

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const exists = await UserModel.findOne({ email: email });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: `User already exists`
            });
        }

        //TODO: Hash Password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const username = await generateUsername(name);

        const user = {
            name,
            email,
            username,
            hashedPassword,
            role: "USER"
        };

        const accountActivationCode = generateActivationCode(user);
        const activationToken = accountActivationCode.token;

        const mailData = {
            user: {
                name: user.name,
                email: user.email,
            },
            activationToken,
            activationCode: accountActivationCode.activationCode
        };

        try {
            await sendMail({
                to: email,
                subject: "",
                template: "activation-mail.ejs",
                data: mailData,
            });

        } catch (error) {
            console.log(error);
        }
        // await emailQueue.add(`${Date.now()}`, {
        //     to: email,
        //     subject: '',
        //     body: '',
        //     mailData,
        // });
        //TODO: Send Email with magic link and Activate user
        return res.status(200).json({
            success: true,
            message: 'Mail Sent',
            activationToken,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error`,
            error,
        });
    }
}

export const activatUser = async (req: Request, res: Response) => {
    try {
        const { activationToken, activationCode } = req.body;
        // TODO: Decode the activationToken 

        const data = verifyCode(activationToken);

        const { activationCode: decodedCode, user } = data as JwtPayload;

        if (decodedCode !== activationCode) {
            return res.status(401).json({
                successs: false,
                message: `Invalid code`
            });
        }
        console.log(user);

        const newUser = await UserModel.create({
            name: user.name,
            email: user.email,
            password: user.hashedPassword,
            username: user.username,
            role: "USER",
        });
        const tokenData = await setToken(newUser);
        if (tokenData.success) {
            return res
                .status(200)
                .cookie("access_token", tokenData.accessToken, accessTokenOptions)
                .cookie("refresh_token", tokenData.refreshToken, refreshTokenOptions)
                .json({
                    message: `User logged in`,
                    accessToken: tokenData.accessToken,
                    user: tokenData.updatedUser
                });
        } else {
            return res.status(400).json({
                message: tokenData.message
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error`,
            error,
        });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const existsUser = await UserModel.findOne({ email: email });
        if (!existsUser) {
            return res.status(400).json({
                success: false,
                message: `User not found!`
            });
        }
        //TODO: Check hashed password
        const isMatched = bcrypt.compareSync(password, existsUser.password);
        if (!isMatched) {
            return res.status(401).json({
                success: false,
                message: `Password don't match`
            });
        }

        //TODO: Send ActiveToken back
        const tokenData = await setToken(existsUser);
        if (tokenData.success) {
            return res
                .status(200)
                .cookie("access_token", tokenData.accessToken, accessTokenOptions)
                .cookie("refresh_token", tokenData.refreshToken, refreshTokenOptions)
                .json({
                    message: `User logged in`,
                    accessToken: tokenData.accessToken,
                    user: tokenData.updatedUser
                });
        } else {
            return res.status(400).json({
                message: tokenData.message
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error`,
            error,
        });
    }
}

export const refreshAccessToken = async (req: Request, res: Response) => {
    try {
        console.log('[REFRESH_TOKEN_CONTROLLER]', req.cookies);
        const refreshToken = req.cookies.refresh_token as string;
        const decoded = verifyRefreshToken(refreshToken, process.env.REFRESH_TOKEN || "") as JwtPayload;
        console.log('[REFRESH_TOKEN_CONTROLLER]: After decoding', decoded);
        if (!decoded) {
            return res.status(401).json({ message: `Couldn't refresh token` });
        }

        const session = await redis.get(decoded.id as string);
        if (!session) {
            return res.status(401).json({ message: `Couldn't refresh token` });
        }

        const user = JSON.parse(session);
        console.log('[USER]', user);
        const tokenData = await setToken(user);

        if (tokenData.success) {
            await redis.set(user._id, JSON.stringify(tokenData.updatedUser), "EX", 604800);
            req.user = tokenData.updatedUser;
            return res
                .status(200)
                .cookie("access_token", tokenData.accessToken, accessTokenOptions)
                .cookie("refresh_token", tokenData.refreshToken, refreshTokenOptions)
                .json({
                    message: `Token refreshed`,
                    accessToken: tokenData.accessToken,
                    user: tokenData.updatedUser
                });
        } else {
            return res.status(400).json({
                message: tokenData.message
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error`,
            error,
        });
    }
}