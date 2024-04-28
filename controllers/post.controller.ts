import { Request, Response } from "express";
import PostModel from "../models/posts.model";
import BlogService from "../services/blog.service";
import LikeService from "../services/like.service";

const MAX_LIMIT = 5;

export const createBlog = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        let { title, description, thumbnail, content, tags, id } = req.body;
        if (!title.length) {
            return res.status(403).json({ message: `Need a title` });
        }
        if (!thumbnail.length) {
            return res.status(403).json({ message: `Need a thumbnail` });
        }
        if (!description.length || description.length > 100) {
            return res.status(403).json({ message: `Need a description` });
        }
        if (!content.blocks.length) {
            return res.status(403).json({ message: `Need content` });
        }
        if (!tags.length || tags.length > 10) {
            return res.status(403).json({ message: `Need tags` });
        }
        tags = tags.map((tag: string) => tag.toLowerCase());
        let newBlog;
        const data = {
            title,
            description,
            thumbnail,
            content,
            tags,
            authorId: user?.id
        };
        if (id) {
            newBlog = await BlogService.updateBlog({ id, payload: data });
        } else {
            newBlog = await BlogService.createBlog(data);
        }

        return res.status(200).json({
            message: `Blog created`,
            id: newBlog?.id
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

export const fetchMyBlogs = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const blogs = await BlogService.findBlogsOfOneUser({ authorId: user?._id });
        return res.status(200).json({
            message: `Blogs fetched`,
            blogs
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

export const latestBlogs = async (req: Request, res: Response) => {
    try {
        const { page } = req.body;

        const blogs = await BlogService.getBlogs({
            query: {},
            skip: (page - 1) * MAX_LIMIT,
            limit: MAX_LIMIT
        });

        return res.status(200).json({
            message: `Latest Blogs fetched`,
            blogs
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

export const searchBlogs = async (req: Request, res: Response) => {
    try {
        const { tag, page, query, author, eliminate_blog } = req.body;
        let findQuery = {};
        if (tag) {
            findQuery = { tags: tag, _id: { $ne: eliminate_blog } };
        } else if (query) {
            findQuery = { title: new RegExp(query, "i") };
        } else if (author) {
            findQuery = { authorId: author };
        }
        const blogs = await BlogService.getBlogs({
            query: findQuery,
            skip: (page - 1) * MAX_LIMIT,
            limit: MAX_LIMIT
        });

        return res.status(200).json({
            message: `Latest Blogs fetched`,
            blogs
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

export const countDocuments = async (req: Request, res: Response) => {
    try {
        const { tag, query, author } = req.body;
        let findQuery = {};
        if (tag) {
            findQuery = { tags: tag };
        } else if (query) {
            findQuery = { title: new RegExp(query, "i") };
        } else if (author) {
            findQuery = { authorId: author };
        }
        const totalCount = await PostModel.countDocuments(findQuery);
        return res.status(200).json({
            message: `Total Docs Count`,
            totalCount
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

export const getBlog = async (req: Request, res: Response) => {
    try {
        const { blog_id } = req.body;
        const incrementVal = 1;
        if (!blog_id) {
            return res.status(403).json({ messgae: `Provide Blog Id` });
        }

        const blog = await BlogService.getBlog({
            id: blog_id,
            incrementVal
        });

        return res.status(200).json({
            message: `Blog Fetched`,
            blog
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

export const likeBlog = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { blog_id, isLiked } = req.body;
        const incVal = !isLiked ? 1 : -1;
        if (!blog_id) {
            return res.status(403).json({ message: `Id required` });
        }
        const existsBlog = await BlogService.getBlogById(blog_id);
        if (!existsBlog) {
            return res.status(400).json({ message: `Blog doesn't exists` });
        }
        const updatedBlog = await BlogService.likeBlog({
            id: blog_id,
            incVal
        });

        if (isLiked) {
            await LikeService.likeBlog({
                userId: user?._id,
                blogId: blog_id
            });
        } else {
            await LikeService.unLikeBlog({
                userId: user?._id,
                blogId: blog_id
            });
        }

        return res.status(200).json({ message: `Blog liked` });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error`,
            error,
        });
    }
}

export const isLikedByUser = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { blog_id } = req.body;
        if (!blog_id) {
            return res.status(403).json({ message: `Id required` });
        }
        const existsBlog = await BlogService.getBlogById(blog_id);
        if (!existsBlog) {
            return res.status(400).json({ message: `Blog doesn't exists` });
        }
        const isLiked = await LikeService.findLike({
            userId: user?._id,
            blogId: blog_id,
        });
        return res.status(200).json({
            liked: !!isLiked
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