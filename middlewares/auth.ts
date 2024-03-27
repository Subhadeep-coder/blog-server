import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import dotenv from 'dotenv';
dotenv.config();

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const access_token = req.cookies.access_token;

        if (!access_token) {
            return res.status(400).json({
                message: `Please Login to access this resource`
            });
        }
        
        const decoded = jwt.verify(
            access_token,
            process.env.ACCESS_TOKEN as string
        ) as JwtPayload;

        if (!decoded) {
            return res.status(400).json({
                message: `This access token is not valid`
            });
        }

        const user = await redis.get(decoded.id);

        if (!user) {
            return res.status(400).json({
                message: `Please Login to access this resource`
            });
        }

        req.user = JSON.parse(user); // Follow this -> https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error`,
            error,
        });
    }
}

export const authorizeRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log('Roles:', roles);
        if (!roles.includes(req?.user?.role || "")) {
            return res.status(400).json({
                message: `Role ${req.user?.role} is not allowed to access this resource`
            });
        }
        next();
    }
}
