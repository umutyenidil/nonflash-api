import fs from 'fs';
import multer from "multer";
import multerUtil from "../utils/multer.util.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userImageDir = `./public/images/${req.user.id}`;

        if (!fs.existsSync(userImageDir)) {
            fs.mkdirSync(userImageDir, {recursive: true});
        }

        cb(null, userImageDir);
    },
    filename: function (req, file, cb) {
        const fileName = multerUtil.generateNewFileName(file);
        cb(null, fileName);
    }
});

const upload = multer({storage});


export default upload.single('image');