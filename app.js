import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { NODE_ENV } from "./utils/utils.js";
import eventRouter from "./routes/eventRoute.js";

const app = express();

//middlewares
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
  g;
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes
app.use("/api/v1/event", eventRouter);
export default app;
