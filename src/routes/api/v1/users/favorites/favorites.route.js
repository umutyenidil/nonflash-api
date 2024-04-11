import express from "express";
import validateAccessTokenMiddleware from "../../../../../middlewares/verifyAccessToken.middleware.js";

const route = express.Router();


route.get('/', validateAccessTokenMiddleware, usersController.readUsers);



route.get('/:id', validateAccessTokenMiddleware, usersController.readUser);

route.post('/create', validateAccessTokenMiddleware, usersController.createUser);


export default route;