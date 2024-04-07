import bcrypt from "bcryptjs";

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const checkPassword = async ({hashedPassword, incomingPassword}) => {
    return await bcrypt.compare(incomingPassword, hashedPassword);
};

export default {
    hashPassword,
    checkPassword,
};