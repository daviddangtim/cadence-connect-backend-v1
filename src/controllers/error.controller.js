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

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateError = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please enter another value`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (NODE_ENV === "production") {
    //HARD COPY THE ERR OBJ TO AVOID MUTATION
    let error = JSON.parse(JSON.stringify(err));

    if (error.name === "CastError") error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateError(error);
    if (error.name === "ValidationError") error = handleValidationError(error);

    sendProdError(error, res);
  }
};
