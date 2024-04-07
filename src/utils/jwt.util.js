import jsonwebtoken from 'jsonwebtoken';
import {json} from "express";
import jwt from "jsonwebtoken";

const createAccessToken = (userId) => {
    return jsonwebtoken.sign(
        {
            user: {
                id: userId,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "10m",
        }
    );
};

const createRefreshToken = (userId, tokenId) => {
    return jsonwebtoken.sign(
        {
            user: {
                id: userId,
            },
            token: {
                id: tokenId,
            },
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

const verifyRefreshToken = (refreshToken) => {
    return jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
};

const verifyAccessToken = (accessToken) => {
    return jsonwebtoken.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
};

export default {
    createAccessToken,
    createRefreshToken,
    verifyRefreshToken,
    verifyAccessToken,
};