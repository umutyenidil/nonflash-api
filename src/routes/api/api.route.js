import express from "express";
import v1Route from './v1/v1.route.js';

const route = express.Router();

route.use('/v1', v1Route);

export default route;