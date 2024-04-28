import LikeModel from "../models/like.model";

class LikeService {
    public static async likeBlog({ userId, blogId }: { userId: string, blogId: string }) {
        return LikeModel.create({
            user: userId,
            blog: blogId
        });
    }

    public static async unLikeBlog({ userId, blogId }: { userId: string, blogId: string }) {
        return LikeModel.findOneAndDelete({
            user: userId,
            blog: blogId
        });
    }

    public static async findLike({ userId, blogId }: { userId: string, blogId: string }) {
        return LikeModel.findOne({
            user: userId,
            blog: blogId
        });
    }
}

export default LikeService;