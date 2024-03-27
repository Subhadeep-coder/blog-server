import express from 'express';
import {
    authorizeRole,
    isAuthenticated
} from '../middlewares/auth';
import {
    changePassword,
    getSelf,
    getUser,
    searchUsers,
    updateRole,
    updateUsername
} from '../controllers/user.controller';
const userRouter = express.Router();

userRouter.get('/get-myself', isAuthenticated, getSelf);
userRouter.get('/get-user', isAuthenticated, getUser);
userRouter.put('/update-username', isAuthenticated, updateUsername);
userRouter.put('/change-password', isAuthenticated, changePassword);
userRouter.get('/search-users', isAuthenticated, searchUsers);
userRouter.put('/update-role', isAuthenticated, authorizeRole("ADMIN"), updateRole);

export default userRouter;