import express from "express";
import auth from "../../../../controllers/api/v1/auth/auth.controller.js";
import validateAccessToken from "../../../../middlewares/verifyAccessToken.middleware.js";

const route = express.Router();

route.post('/register', auth.register);

route.post('/login', auth.login);

route.post('/resetPassword', validateAccessToken, auth.resetPassword);

route.post('/accessToken', auth.getAccessToken);

route.post('/refreshToken', auth.getRefreshToken);

route.get('/currentUser', validateAccessToken, auth.getCurrentUser);

route.post('/logout', auth.logout);

export default route;