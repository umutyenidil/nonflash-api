import express from "express";
import usersController from '../../../../controllers/api/v1/users/users.controller.js';
import imagesRoute from "../files/files.route.js";
import validateAccessTokenMiddleware from "../../../../middlewares/verifyAccessToken.middleware.js";
import favoritesRoute from "./favorites/favorites.route.js";

const route = express.Router();

route.use('/favorites', favoritesRoute);

route.get('/', validateAccessTokenMiddleware, usersController.readUsers);

route.get('/:id', validateAccessTokenMiddleware, usersController.readUser);

route.post('/create', validateAccessTokenMiddleware, usersController.createUser);


export default route;