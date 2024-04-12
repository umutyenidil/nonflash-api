import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auth',
            index: true,
            required: true,
        },
        name: {
            type: mongoose.Schema.Types.String,
            required: true,
        },
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tag',
            }
        ],
        imageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image',
            required: true,
        }
    },
);

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;