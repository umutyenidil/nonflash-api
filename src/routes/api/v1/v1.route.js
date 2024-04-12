import express from "express";
import usersRoute from "./users/users.route.js";
import authRoute from "./auth/auth.route.js";
import filesRoute from "./files/files.route.js";
import postsRoute from "./posts/posts.route.js";

const route = express.Router();

route.use('/files', filesRoute);

route.use('/users', usersRoute);

route.use('/auth', authRoute);

route.use('/posts', postsRoute);

export default route;