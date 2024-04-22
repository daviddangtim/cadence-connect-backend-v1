/*eslint-disable*/
import AppError from "../utils/app.error.js";
import cloneDeep from "clone-deep";
const { NODE_ENV } = process.env;

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
    console.error(`ERROR: 💥💥💥💥`, err);
    res.status(err.statusCode).json({
      status: 500,
      message: "Something went very wrong!",
    });
  }
};

const handleDbValidationErr = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleDbDuplicateErr = (err) => {
  const value = Object.values(err.keyValue).map((el) => el);
  const message = `Duplicate field value: ${value.join(" ")}. Please enter another value`;
  return new AppError(message, 400);
};

const handleDbCastErr = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleJwtTokenExpiredError = (err) =>
  new AppError("Token is expired. Login to gain access", 401);

const handleJwtJsonWebTokenError = (err) =>
  new AppError("Invalid token. Login to gain access", 401);

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (NODE_ENV === "production") {
    let error = cloneDeep(err);

    if (error.name === "ValidationError") error = handleDbValidationErr(err);
    if (error.code === 11000) error = handleDbDuplicateErr(err);
    if (error.name === "CastError") error = handleDbCastErr(err);
    if (error.name === "TokenExpiredError")
      error = handleJwtTokenExpiredError();
    if (error.name === "JsonWebTokenError")
      error = handleJwtJsonWebTokenError();
    sendProdError(error, res);
  }
};
