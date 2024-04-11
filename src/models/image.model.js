import mongoose from "mongoose";

const ImageSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auth',
            index: true,
            required: true,
        },
        url:{
            type:mongoose.Schema.Types.String,
            required:true,
        }
    },
);

const ImageModel = mongoose.model('Image', ImageSchema);

export default ImageModel;