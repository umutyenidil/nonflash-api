import express from "express";
import imagesRoute from "./images/images.route.js";

const route = express.Router();

route.use('/images', imagesRoute);

export default route;