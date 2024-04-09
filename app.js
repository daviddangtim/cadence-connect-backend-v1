import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { NODE_ENV } from "./src/utils/utils.js";
import serviceRouter from "./src/routes/service.route.js";

const app = express();

//middlewares
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes
app.use("/api/v1/services", serviceRouter);
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});
export default app;
