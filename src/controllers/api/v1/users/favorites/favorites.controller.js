import UserModel from "../../../../../models/user.model.js";

const readAllFavorites = async (req, res) => {
    try {
        const data = await UserModel.findOne({authId: req.user.id}).populate({
            path: 'favorites',
            populate: [
                {path: 'imageId'},
                {path: 'tags'},
            ],
        }).select('favorites');

        console.log(data.favorites);

        return res.status(200).json({
            message: 'data fetched successfully',
            data: data.favorites,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'internal server error',
        });
    }
};

const addFavorite = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!(req.body.data && req.body.data.postId)) {
            return res.status(400).json({
                message: 'bad request',
                errors: {
                    postId: 'postId needed',
                },
            });
        }

        const user = await UserModel.findOneAndUpdate(
            {
                authId: userId,
            },
            {
                $push: {favorites: req.body.data.postId},
            }
        );

        console.log(user);

        return res.status(200).json({
            message: 'successful',
        });
    } catch (err) {
        return res.status(500).json({
            message: 'internal server error',
        });
    }
};

export default {
    readAllFavorites,
    addFavorite,
};