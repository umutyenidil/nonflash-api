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
        firstName: {
            type: mongoose.Schema.Types.String,
            required: true,
        },
        lastName: {
            type: mongoose.Schema.Types.String,
            required: true,
        },
        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Image',
            }
        ]
    },
);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;