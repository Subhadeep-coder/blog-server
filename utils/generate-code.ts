import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateActivationCode = (user: any) => {
    const activationCode = crypto.randomInt(1000000).toString();

    // Generate Token
    const token = jwt.sign(
        { user, activationCode },
        process.env.JWT_SECRET as string,
        { expiresIn: "5m" }
    );

    return { token, activationCode };
}

export const verifyCode=(activationToken:string)=>{
    const data= jwt.verify(
        activationToken,
        process.env.JWT_SECRET as string
    );

    return data;
}