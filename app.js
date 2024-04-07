import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { NOD_ENV } from "./utils/utils.js";

const app = express();

//middlewares
if (NOD_ENV === "development") {
  app.use(morgan("dev"));g
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes
export default app;
