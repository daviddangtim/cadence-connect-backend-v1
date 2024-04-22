import AppError from "../utils/app.error.js";
import Jwt from "../utils/jwt.js";
import catchAsync from "../utils/catch.async.js";
import User from "../models/user.model.js";

const { JWT_EXPIRES_IN, JWT_SECRET } = process.env;
const jwt = new Jwt(JWT_SECRET, JWT_EXPIRES_IN);

export const signUp = catchAsync(async (req, res, next) => {
  const user = await User.create({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.body.photo,
    role: req.body.role, // TODO: make sure this is removed in PROD.
    passwordUpdatedAt: req.body.passwordUpdatedAt, // TODO: make sure this is removed in PROD.
  });

  const token = await jwt.sign(user._id);

  res.status(200).json({
    status: "success",
    token,
    data: { user },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password is required"), 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.validatePassword(user.password, password))) {
    return next(new AppError("Password or email is incorrect", 400));
  }

  user.password = undefined;
  const token = await jwt.sign(user._id);

  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in, please log in to access", 401),
    );
  }

  const decoded = await jwt.verify(token);

  const user = await User.findById(decoded.payload);

  if (!user) {
    return next(
      new AppError("The user belonging to this token no longer exits", 401),
    );
  }

  if (user.passwordUpdatedAfterJwt(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again", 401),
    );
  }
  req.user = user;
  next();
});

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You are not permitted to perform this action`, 403),
      );
    }
    next();
  };

export const forgotPassword = catchAsync(async (req, res, next) => {});

export const resetPassword = catchAsync(async (req, res, next) => {});
