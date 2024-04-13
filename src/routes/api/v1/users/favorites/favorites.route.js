import express from "express";
import validateAccessTokenMiddleware from "../../../../../middlewares/verifyAccessToken.middleware.js";
import favoritesController from "../../../../../controllers/api/v1/users/favorites/favorites.controller.js";

const route = express.Router();


route.get('/', validateAccessTokenMiddleware, favoritesController.readAllFavorites);

route.post('/add', validateAccessTokenMiddleware, favoritesController.addFavorite);



export default route;