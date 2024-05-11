/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import path from "node:path"
import AppError from "./src/utils/app.error.js";
import globalErrorController from "./src/controllers/error.controller.js";
import serviceRoute from "./src/routes/service.route.js";
import userRoute from "./src/routes/user.route.js";

const app = express();




app.set('views', path.join('views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/services", serviceRoute);
app.use("/api/v1/users", userRoute);


app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorController);

export default app;
