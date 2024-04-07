import express from "express";
import apiRoute from './api/api.route.js';

const route = express.Router();

route.use('/api', apiRoute);

export default route;