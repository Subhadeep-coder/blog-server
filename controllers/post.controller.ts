import { Request, Response } from "express";
import PostModel from "../models/posts.model";

const MAX_LIMIT = 5;

export const createBlog = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        let { title, description, thumbnail, content, tags } = req.body;
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

        const newBlog = PostModel.create({
            title,
            description,
            thumbnail,
            content,
            tags,
            authorId: user?.id
        });

        return res.status(200).json({
            message: `Blog created`,
            newBlog
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
        const blogs = await PostModel.find({ authorId: user?.id });
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

        const blogs = await PostModel.find()
            .populate({
                path: 'authorId',
                select: 'name username avatar -_id'
            })
            .sort({ "createdAt": -1 })
            .select("title description thumbnail tags createdAt -_id")
            .skip((page - 1) * MAX_LIMIT)
            .limit(MAX_LIMIT);

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
        const { tag, page, query, author } = req.body;
        let findQuery = {};
        if (tag) {
            findQuery = { tags: tag };
        } else if (query) {
            findQuery = { title: new RegExp(query, "i") };
        } else if (author) {
            findQuery = { authorId: author };
        }
        const blogs = await PostModel.find(findQuery)
            .populate({
                path: 'authorId',
                select: 'name username avatar -_id'
            })
            .sort({ "createdAt": -1 })
            .select("title description thumbnail tags createdAt -_id")
            .skip((page - 1) * MAX_LIMIT)
            .limit(MAX_LIMIT);
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

