import mongoose from "mongoose";

const AuthSchema = mongoose.Schema(
    {
        username: {
            type: mongoose.Schema.Types.String,
            required: true,
            trim: true,
        },
        emailAddress: {
            type: mongoose.Schema.Types.String,
            index: true,
            unique: true,
            required: true,
            trim: true,
        },
        password: {
            type: mongoose.Schema.Types.String,
            required: true,
        }
    },
);

const AuthModel = mongoose.model('Auth', AuthSchema);

export default AuthModel;