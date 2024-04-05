import { Request, Response } from "express";
import PostModel from "../models/posts.model";
import CommentModel from "../models/comment.model";

export const commentOnPost = async (req: Request, res: Response) => {
    try {
        const { blogId, content, parentCommentId } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: `User not found` });
        }
        if (!blogId || !content) {
            return res.status(403).json({ message: `BlogId and comment not found` });
        }

        const existingBlog = await PostModel.findById(blogId);
        if (!existingBlog) {
            return res.status(400).json({ message: `Blog not found` });
        }

        const comment = await CommentModel.create({
            user: user._id,
            blog: existingBlog._id,
            comment: content,
            isReplying: parentCommentId ? true : false,
            repliedTo: parentCommentId ? parentCommentId : null
        });
        const updatedBlog = await PostModel.findByIdAndUpdate(existingBlog._id, {
            $inc: {
                "activities.total_comments": 1,
            }
        });

        return res.status(200).json({ message: `Commented successfully` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error`,
            error,
        });
    }
}

export const editComment = async (req: Request, res: Response) => {
    try {
        const { content, commentId } = req.body;
        if (!commentId) {
            return res.status(400).json({ message: `Commentid needed` });
        }
        if (!content) {
            return res.status(403).json({ message: `Comment needed` });
        }

        const existingComment = await CommentModel.findById(commentId);
        if (!existingComment) {
            return res.status(400).json({ message: `Comment not found` });
        }

        if (existingComment.comment === content) {
            return res.status(403).json({ message: `Same comment has been uploaded` });
        }

        const updateComment = await CommentModel.findByIdAndUpdate(commentId, {
            $set: {
                comment: content,
                isEdited: true
            }
        }, { new: true });

        return res.status(200).json({ message: `Comment updated`, updateComment });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error`,
            error,
        });
    }
}