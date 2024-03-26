import express from 'express';
import {
    authorizeRole,
    isAuthenticated
} from '../middlewares/auth';
import {
    countDocuments,
    createBlog,
    fetchMyBlogs,
    latestBlogs,
    searchBlogs
} from '../controllers/post.controller';

const postRouter = express.Router();

postRouter.post('/create-blog', isAuthenticated, authorizeRole('ADMIN', 'MODERATOR'), createBlog);
postRouter.get('/get-my-blogs', isAuthenticated, authorizeRole("ADMIN", "MODERATOR"), fetchMyBlogs);
postRouter.get('/get-latest-blogs', isAuthenticated, latestBlogs);
postRouter.get('/search-blogs', isAuthenticated, searchBlogs);
postRouter.get('/get-blog-count', isAuthenticated, countDocuments);

export default postRouter;