import mongoose from "mongoose";

const TagSchema = mongoose.Schema(
    {
        name: {
            type: mongoose.Schema.Types.String,
            required: true,
        },
    },
);

const TagModel = mongoose.model('Tag', TagSchema);

export default TagModel;