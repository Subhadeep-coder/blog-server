import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
dotenv.config();
export const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
}));

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

// Testing API
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: `API working!`,
    });
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    throw new Error(`Route ${req.originalUrl} not found!!`);
})