import mongoose, { Document, Model, Schema } from "mongoose"

export interface IComment extends Document {
    user: typeof Schema.Types.ObjectId;
    blog: typeof Schema.Types.ObjectId;
    comment: string;
    isEdited: boolean;
    isReplying?: boolean;
    repliedTo?: typeof Schema.Types.ObjectId;
}

const CommentSchema: Schema<IComment> = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    isReplying: {
        type: Boolean,
        default: false
    },
    repliedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
        default: null
    },
}, { timestamps: true });

const CommentModel: Model<IComment> = mongoose.model('comment', CommentSchema);

export default CommentModel;