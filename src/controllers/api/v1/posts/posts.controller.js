import TagModel from "../../../../models/tag.model.js";
import mongoose from "mongoose";
import PostModel from "../../../../models/post.model.js";
import ImageModel from "../../../../models/image.model.js";

const readPosts = async (req, res) => {
    try {
        console.log('successful');
        return res.status(200).json({
            message: "posts have fetched",
            data: [],
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "internal server error",
        });
    }
};

const createPost = async (req, res) => {
    try {
        if (!(req.body.name)) {
            return res.status(400).json({
                message: "bad request",
            });
        }

        if (req.body.name.length === 0) {
            return res.status(400).json({
                message: "bad request",
            });
        }

        const tags = [];
        if (req.body.tags) {
            await mongoose.connection.transaction(async (session) => {
                for (const tag of req.body.tags) {
                    const data = await TagModel.findOne({name: tag});
                    if (data) {
                        tags.push(data._id);
                        continue;
                    }
                    const result = await TagModel.create([{name: tag}], {session});
                    tags.push(result[0]._id);
                }
            });
        }

        const imageUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}/${req.file.path}`.replaceAll('\\', '/');

        const imageCreateResult = await ImageModel.create({
            userId: req.user.id,
            url: imageUrl,
        });

        const result = await PostModel.create({
            userId: req.user.id,
            name: req.body.name,
            tags: tags,
            imageId: imageCreateResult._id,
        });

        return res.status(201).json({
            message: "post create operation successful",
            data: result,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "internal server error",
        });
    }
};
//
// const resetPassword = async (req, res) => {
//     try {
//         if (!(req.body.data && req.body.data.password && req.body.data.newPassword)) {
//             return res.status(400).json({
//                 message: "bad request",
//             });
//         }
//
//         const userId = req.user.id;
//
//         const auth = await AuthModel.findById(userId);
//
//         if (!auth) {
//             return res.status(404).json({
//                 message: "user not found",
//             });
//         }
//
//         const isPasswordMatched = await bcryptUtil.checkPassword({
//             hashedPassword: auth.password,
//             incomingPassword: req.body.data.password
//         });
//
//
//         if (!isPasswordMatched) {
//             return res.status(401).json({
//                 errors: {
//                     password: `wrong password`,
//                 },
//             });
//         }
//
//         const newPassword = await bcryptUtil.hashPassword(req.body.data.newPassword);
//
//         const result = await AuthModel.findByIdAndUpdate(userId, {
//             password: newPassword,
//         });
//
//         return res.status(200).json({
//             message: "password reset operation successful",
//         });
//         // if (!(req.body.data && req.body.data.refreshToken)) {
//         //     return res.status(400).json({
//         //         errors: {
//         //             default: "refreshToken has needed",
//         //         },
//         //     });
//         // }
//         //
//         // const decodedRefreshToken = jwtUtil.verifyRefreshToken(req.body.data.refreshToken);
//         //
//         // await TokenModel.findOneAndDelete({userId: decodedRefreshToken.user.id});
//         //
//         // return res.status(200).json({
//         //     message: "logout successful",
//         // });
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({
//             errors: {
//                 default: "internal server error",
//             },
//         });
//     }
// };

export default {
    readPosts,
    createPost,
};