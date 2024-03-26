import mongoose, { Document, Model, Schema } from "mongoose";

// interface Content {
//     content: string | {
//         image: {
//             url: string;
//         },
//         caption: string;
//     };
// };

export interface IPosts extends Document {
    authorId: typeof Schema.Types.ObjectId;
    title: string;
    description: string;
    thumbnail: {
        public_id: string;
        url: string;
    },
    content: ArrayConstructor;
    tags: Array<string>;
};


const PostSchema: Schema<IPosts> = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    content: {
        type: Array,
        required: true,
    },
    tags: [{
        type: String
    }]
}, { timestamps: true });

const PostModel: Model<IPosts> = mongoose.model('post', PostSchema);

export default PostModel;