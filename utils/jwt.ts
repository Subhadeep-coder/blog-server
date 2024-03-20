import dotenv from 'dotenv';
import { IUser } from '../models/user.model';
import { redis } from './redis';
import jwt from 'jsonwebtoken';
dotenv.config();


interface TokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: 'lax' | 'strict' | 'none' | undefined;
    secure?: boolean;
};

// Env variables to integrate with fallback values
export const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300', 10);
export const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10);

//Options for cookies
export const accessTokenOptions: TokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
};
export const refreshTokenOptions: TokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
};

export const setToken = async (user: IUser) => {
    try {
        console.log('[SET_TOKEN]');
        const accessToken = user.SignAccessToken();
        const refreshToken = user.SignRefreshToken();
        console.log('[BOTH_TOKENS_ARE_SET]');

        user.refreshToken = refreshToken;
        const updatedUser = await user.save();

        // Set it to redis
        redis.set(user._id, JSON.stringify(user) as any);

        if (process.env.NODE_DEV) {
            accessTokenOptions.secure = true;
        }
        // res.cookie("access_token", accessToken, accessTokenOptions);
        // res.cookie("refresh_token", refreshToken, refreshTokenOptions);
        return {
            success: true,
            updatedUser,
            accessToken,
            refreshToken,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: `Error occured while getting token ${error as string}`
        };
    }
}

export const verifyCode = (payload: any, secret: string) => {
    const data= jwt.verify(
        payload,
        secret
    );
    console.log('VERIFY_TOKEN',data);
    return data;
}