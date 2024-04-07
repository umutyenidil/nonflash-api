import express from "express";
import filesController from '../../../../../controllers/api/v1/files/images/images.controller.js';
import validateAccessTokenMiddleware from "../../../../../middlewares/verifyAccessToken.middleware.js";
import imageUploadMiddleware from "../../../../../middlewares/imageUploadMiddleware.js";

const route = express.Router();

route.get('/', validateAccessTokenMiddleware, filesController.readImages);

route.post('/upload', validateAccessTokenMiddleware, imageUploadMiddleware, filesController.uploadImage);

route.post('/delete/:id', validateAccessTokenMiddleware, filesController.deleteImage);

route.get('/:id', validateAccessTokenMiddleware, filesController.readImage);

export default route;