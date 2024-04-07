import UserModel from "../../../../models/user.model.js";

const readUsers = (req, res) => {
    try {
        return res.status(200).json({
            message: 'data fetched successfully',
            data: [],
        });
    } catch (err) {
        return res.status(500).json({
            message: 'an error has occured',
        });
    }
}

const readUser = (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);
    } catch (err) {
        return res.status(500).json({
            message: 'an error has occured',
        });
    }

};

const createUser = async (req, res) => {
    try {
        const data = req.body.data;
        const authId = req.user.id;

        if (!data) {
            return res.status(400).json({
                errors: {
                    default: 'bad request',
                },
            });
        }

        if (!(data.firstName && data.lastName)) {
            return res.status(400).json({
                errors: {
                    default: 'bad request',
                },
            });
        }

        const result = await UserModel.create({
            ...data,
            authId: authId
        });

        return res.status(201).json({
            message: "user details have been added successfully",
            data: result,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'an error has occured',
        });
    }
}
export default {
    readUsers,
    readUser,
    createUser,
};