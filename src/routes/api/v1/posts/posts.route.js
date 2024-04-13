import express from "express";
import postsController from "../../../../controllers/api/v1/posts/posts.controller.js";
import validateAccessToken from "../../../../middlewares/verifyAccessToken.middleware.js";
import imageUploadMiddleware from "../../../../middlewares/imageUploadMiddleware.js";

const route = express.Router();

route.get('/', validateAccessToken, postsController.readPosts);

route.post('/create', validateAccessToken, imageUploadMiddleware, postsController.createPost);

route.post('/delete', validateAccessToken, postsController.deletePost);

export default route;