import PostModel from "../models/posts.model";

interface CreateBlogPayload {
    title: string;
    description: string;
    thumbnail: string;
    content: any;
    tags: Array<string>;
    authorId: string;
}

interface UpdateBlogPayload {
    id: string;
    payload: CreateBlogPayload;
}

class BlogService {
    public static async createBlog(payload: CreateBlogPayload) {
        return PostModel.create(payload);
    }

    public static async updateBlog(payload: UpdateBlogPayload) {
        return PostModel.findByIdAndUpdate(payload.id, {
            $set: payload.payload
        });
    }

    public static async getBlogById({ id }: { id: string }) {
        return PostModel.findById(id);
    }

    public static async findBlogsOfOneUser({ authorId }: { authorId: string }) {
        return PostModel.find({ authorId });
    }

    public static async getBlogs({
        query,
        skip,
        limit
    }: {
        query?: any;
        skip: number;
        limit: number;
    }) {
        return PostModel
            .find(query)
            .populate({
                path: 'authorId',
                select: 'name username avatar -_id'
            })
            .sort({ "createdAt": -1 })
            .select("title description thumbnail tags createdAt -_id")
            .skip(skip)
            .limit(limit);
    }

    public static async getBlog({ id, incrementVal }: { id: string, incrementVal: number }) {
        return PostModel
            .findByIdAndUpdate(id, {
                $inc: {
                    "activities.total_reads": incrementVal
                }
            })
            .populate({
                path: 'authorId',
                select: "name username avatar"
            });
    }

    public static async likeBlog({ id, incVal }: { id: string, incVal: number }) {
        return PostModel.findByIdAndUpdate(id, {
            $inc: {
                "activities.total_likes": incVal,
            }
        })
    }
}

export default BlogService;