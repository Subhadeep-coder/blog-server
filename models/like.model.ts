import mongoose, { Document, Model, Schema } from "mongoose";

export interface ILike extends Document {
    user: typeof Schema.Types.ObjectId;
    blog: typeof Schema.Types.ObjectId;
}

const LikeSchema: Schema<ILike> = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true,
    }
}, { timestamps: true });

const LikeModel: Model<ILike> = mongoose.model('like', LikeSchema);

export default LikeModel;