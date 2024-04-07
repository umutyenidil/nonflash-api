
const readImages = (req, res) => {
    try {
        console.log('readImages works');
    } catch (err) {
        return res.status(500).json({
            message: 'an error has occured',
        });
    }
};

const readImage = (req, res) => {
    try {
        console.log('readImage works');
    } catch (err) {
        return res.status(500).json({
            message: 'an error has occured',
        });
    }
};

const uploadImage = (req, res) => {
    try {
        console.log()
        return res.status(200).json({
            message: 'image uploaded successfully',
            data: req.file
        });
    } catch (err) {
        return res.status(500).json({
            message: 'an error has occured',
        });
    }
};

const deleteImage = (req, res) => {
    try {
        console.log('deleteImage works');
    } catch (err) {
        return res.status(500).json({
            message: 'an error has occured',
        });
    }
};

export default {
    readImages,
    readImage,
    uploadImage,
    deleteImage,
};