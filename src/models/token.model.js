import mongoose from "mongoose";

const TokenSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auth',
            index: true,
            required: true,
        }
    },
);

const TokenModel = mongoose.model('Token', TokenSchema);

export default TokenModel;