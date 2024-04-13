import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        authId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auth',
            required: true,
            index: true,
            unique: true,
        },
        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            }
        ]
    },
);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;