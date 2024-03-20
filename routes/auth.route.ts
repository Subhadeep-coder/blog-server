import express from 'express';
import { activatUser, login, refreshAccessToken, signup } from '../controllers/auth.controller';
import { isAuthenticated } from '../middlewares/auth';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/activate-user', activatUser);
authRouter.post('/login', login);
authRouter.get('/refresh', refreshAccessToken);

export default authRouter;