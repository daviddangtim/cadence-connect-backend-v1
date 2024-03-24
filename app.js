import express from "express";
// eslint-disable-next-line import/no-extraneous-dependencies
import bodyParser from "body-parser";

const app = express();

//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes
export default app;
