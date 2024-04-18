import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import { NODE_ENV } from "./src/utils/utils.js";
import serviceRouter from "./src/routes/service.route.js";
import userRouter from "./src/routes/user.route.js";
import AppError from "./src/utils/App.error.js";
import globalErrorController from "./src/controllers/error.controller.js";

const app = express();

//General Middlewares
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routes Middlewares
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/users", userRouter);

// ERROR HANDLING MIDDLEWARES
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorController);

export default app;
