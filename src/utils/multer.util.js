import mongoose from "mongoose";

const generateNewFileName = (file) => {
    const splitFileOriginalName = file.originalname.split('.');
    const fileExtension = splitFileOriginalName[splitFileOriginalName.length - 1];
    const fileName = new mongoose.Types.ObjectId();
    return fileName + "." + fileExtension;
};

export default {
    generateNewFileName,
};