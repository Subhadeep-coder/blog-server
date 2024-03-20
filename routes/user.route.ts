import express from 'express';
import { isAuthenticated } from '../middlewares/auth';
import { getSelf } from '../controllers/user.controller';
const userRouter = express.Router();

userRouter.get('/get-myself', getSelf);

export default userRouter;