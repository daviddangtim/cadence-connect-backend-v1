import cloneDeep from "clone-deep";
import { NODE_ENV } from "../utils/utils.js";
import AppError from "../utils/App.error.js";

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    name: err.name,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(`ERROR: 💥`, err);
    res.status(err.statusCode).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

const handleCastErr = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErr = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please enter another value`;
  return new AppError(message, 400);
};

const handleValidationErr = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleSyntaxErr = (err) => new AppError(err.message, 400);

const handleJTWErr = () =>
  new AppError("Invalid token. Login to gain access", 401);

const handleJWTEXErr = () =>
  new AppError("Token is expired. Login to gain access", 401);

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (NODE_ENV === "production") {
    let error = cloneDeep(err);
    if (error.name === "CastError") error = handleCastErr(error);
    if (error.code === 11000) error = handleDuplicateErr(error);
    if (error.name === "ValidationError") error = handleValidationErr(error);
    if (error.name === "SyntaxError") error = handleSyntaxErr(error);
    if (error.name === "JsonWebTokenError") error = handleJTWErr();
    if (error.name === "TokenExpiredError") error = handleJWTEXErr();

    sendProdError(error, res);
  }
};
