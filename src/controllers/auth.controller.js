import { promisify } from "util";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catch.async.js";
import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../utils/utils.js";
import AppError from "../utils/App.error.js";

const signKey = async (id) => {
  await jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userType: req.body.userType,
    passwordUpdatedAt: req.body.passwordUpdatedAt,
  });

  const token = await signKey(newUser._id);

  newUser.password = undefined;
  res.status(200).json({
    status: "success",
    token,
    data: { newUser },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password is required", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 400));
  }

  const token = await signKey(user._id);

  user.password = undefined; //Password is not sent to client
  res.status(200).json({ token, user });
});

export const protect = catchAsync(async (req, res, next) => {
  // 1) GET TOKEN AND CHECK IF NOT UNDEFINED OR NULL
  let token;

  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please login to access", 401),
    );
  }

  // 2) VERIFY TOKEN
  const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

  // if (!decoded) {
  //   return next(
  //     new AppError("You are not logged in. Please login to access", 400),
  //   );
  // }
  next();
});
