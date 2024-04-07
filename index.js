import express from 'express';
import dotenv from 'dotenv';
import routes from "./src/routes/routes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use('/', routes);

import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

mongoose.connect(process.env.MONGODB_URI, {})
    .then(() => {
        app.listen(PORT, HOST, () => {
            console.log(`listening on ${HOST}:${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    });

