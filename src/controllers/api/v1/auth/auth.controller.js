import AuthModel from "../../../../models/auth.model.js";

import bcrypt from 'bcryptjs';
import jwtUtil from "../../../../utils/jwt.util.js";
import TokenModel from "../../../../models/token.model.js";
import mongoose from "mongoose";
import bcryptUtil from "../../../../utils/bcrypt.util.js";
import UserModel from "../../../../models/user.model.js";

const register = async (req, res) => {
    try {
        const data = req.body.data;

        if (!data) {
            return res.status(400).json({
                errors: {
                    default: 'bad request',
                },
            });
        }

        if (!(data.username && data.emailAddress && data.password)) {
            return res.status(400).json({
                errors: {
                    default: 'bad request',
                },
            });
        }

        const user = await AuthModel.findOne(
            {
                emailAddress: data.emailAddress,
            }
        );

        if (user) {
            return res.status(409).json({
                errors: {
                    auth: 'email address already in use',
                },
            });
        }

        data.password = await bcryptUtil.hashPassword(data.password);

        let authModelCreateResult;
        let tokenModelCreateResult;
        let userModelCreateResult;
        await mongoose.connection.transaction(async (session) => {
            authModelCreateResult = await AuthModel.create([data], {session});
            authModelCreateResult = authModelCreateResult[0];
            tokenModelCreateResult = await TokenModel.create([{userId: authModelCreateResult._id}], {session});
            tokenModelCreateResult = tokenModelCreateResult[0];
            userModelCreateResult = await UserModel.create([{authId: authModelCreateResult._id}], {session});
            userModelCreateResult = userModelCreateResult[0];
        });

        if (!(authModelCreateResult && tokenModelCreateResult && userModelCreateResult)) {
            return res.status(500).json({
                errors: {
                    auth: 'user not created',
                }
            })
        }

        const accessToken = await jwtUtil.createAccessToken(authModelCreateResult._id);
        const refreshToken = await jwtUtil.createRefreshToken(authModelCreateResult._id, tokenModelCreateResult._id);

        return res.status(201).json({
            message: 'register route works',
            accessToken,
            refreshToken,
            data: authModelCreateResult,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            errors: {
                default: "internal server error",
            },
        });
    }
};

const login = async (req, res) => {
    try {
        const data = req.body.data;

        if (!data) {
            return res.status(400).json({
                message: 'bad request',
            });
        }

        if (data.username && data.emailAddress) {
            return res.status(400).json({
                message: 'bad request',
            });
        }

        if (!(data.username || data.emailAddress && data.password)) {
            return res.status(400).json({
                message: 'bad request',
            });
        }

        let user;

        if (data.username) {
            user = await AuthModel.findOne({username: data.username});
        } else {
            user = await AuthModel.findOne({emailAddress: data.emailAddress});
        }

        if (!user) {
            return res.status(404).json({
                message: 'user not found',
            });
        }

        const isPasswordMatched = await bcryptUtil.checkPassword({
            hashedPassword: user.password,
            incomingPassword: data.password
        });


        if (!isPasswordMatched) {
            return res.status(401).json({
                errors: {
                    auth: `invalid credentials`,
                },
            });
        }

        let tokenModelCreateResult;

        await mongoose.connection.transaction(async (session) => {
            await TokenModel.findOneAndDelete({userId: user._id}, {session});

            tokenModelCreateResult = await TokenModel.create({userId: user._id});
        });

        if (!tokenModelCreateResult) {
            return res.status(500).json({
                message: "internal server error"
            });
        }

        const accessToken = jwtUtil.createAccessToken(user._id);
        const refreshToken = jwtUtil.createRefreshToken(user._id, tokenModelCreateResult._id);

        return res.status(200).json({
            message: "successfully logged in",
            accessToken,
            refreshToken,
            data: user,
        });
    } catch (err) {
        return res.status(500).json({
            errors: {
                default: 'an error has occured',
            },
        });
    }
};

const getAccessToken = async (req, res) => {
    try {
        if (!(req.body.data && req.body.data.refreshToken)) {
            return res.status(400).json({
                errors: {
                    default: "refreshToken has needed",
                },
            });
        }

        const decodedRefreshToken = jwtUtil.verifyRefreshToken(req.body.data.refreshToken);

        const refreshToken = await TokenModel.findById(decodedRefreshToken.token.id);

        if (!refreshToken) {
            return res.status(400).json({
                message: "no refresh token, login",
            });
        }

        const newAccessToken = jwtUtil.createAccessToken(decodedRefreshToken.user.id);

        return res.status(200).json({
            message: "data fetched successfully",
            accessToken: newAccessToken,
            refreshToken: req.body.data.refreshToken,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            errors: {
                default: "internal server error",
            },
        });
    }
};

const getRefreshToken = async (req, res) => {
    try {
        if (!(req.body.data && req.body.data.refreshToken)) {
            return res.status(400).json({
                errors: {
                    default: "refreshToken has needed",
                },
            });
        }

        const decodedRefreshToken = jwtUtil.verifyRefreshToken(req.body.data.refreshToken);

        let tokenModelCreateResult;
        await mongoose.connection.transaction(async (session) => {
            await TokenModel.findOneAndDelete({userId: decodedRefreshToken.user.id}, {session});

            tokenModelCreateResult = await TokenModel.create([{userId: decodedRefreshToken.user.id}], {session});
        });

        console.log("tokenModelCreateResult", tokenModelCreateResult);

        if (!tokenModelCreateResult) {
            return res.status(500).json({
                errors: {
                    default: "internal server error",
                },
            });
        }

        const accessToken = jwtUtil.createAccessToken(decodedRefreshToken.user.id);
        const refreshToken = jwtUtil.createRefreshToken(decodedRefreshToken.user.id, tokenModelCreateResult._id);


        return res.status(200).json({
            message: "data fetched successfully",
            accessToken,
            refreshToken,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            errors: {
                default: "internal server error",
            },
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await AuthModel.findById(userId);

        return res.status(200).json({
            message: 'data fetched successfully',
            data: user,
        });
    } catch (err) {
        return res.status(500).json({
            errors: {
                default: "internal server error",
            },
        });
    }

}

const logout = async (req, res) => {
    try {
        if (!(req.body.data && req.body.data.refreshToken)) {
            return res.status(400).json({
                errors: {
                    default: "refreshToken has needed",
                },
            });
        }

        const decodedRefreshToken = jwtUtil.verifyRefreshToken(req.body.data.refreshToken);

        await TokenModel.findOneAndDelete({userId: decodedRefreshToken.user.id});

        return res.status(200).json({
            message: "logout successful",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            errors: {
                default: "internal server error",
            },
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        if (!(req.body.data && req.body.data.password && req.body.data.newPassword)) {
            return res.status(400).json({
                message: "bad request",
            });
        }

        const userId = req.user.id;

        const auth = await AuthModel.findById(userId);

        if (!auth) {
            return res.status(404).json({
                message: "user not found",
            });
        }

        const isPasswordMatched = await bcryptUtil.checkPassword({
            hashedPassword: auth.password,
            incomingPassword: req.body.data.password
        });


        if (!isPasswordMatched) {
            return res.status(401).json({
                errors: {
                    password: `wrong password`,
                },
            });
        }

        const newPassword = await bcryptUtil.hashPassword(req.body.data.newPassword);

        const result = await AuthModel.findByIdAndUpdate(userId, {
            password:newPassword,
        });

        return res.status(200).json({
            message: "password reset operation successful",
        });
        // if (!(req.body.data && req.body.data.refreshToken)) {
        //     return res.status(400).json({
        //         errors: {
        //             default: "refreshToken has needed",
        //         },
        //     });
        // }
        //
        // const decodedRefreshToken = jwtUtil.verifyRefreshToken(req.body.data.refreshToken);
        //
        // await TokenModel.findOneAndDelete({userId: decodedRefreshToken.user.id});
        //
        // return res.status(200).json({
        //     message: "logout successful",
        // });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            errors: {
                default: "internal server error",
            },
        });
    }
};


export default {
    login,
    register,
    resetPassword,
    getAccessToken,
    getRefreshToken,
    getCurrentUser,
    logout,
};