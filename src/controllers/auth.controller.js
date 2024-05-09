import crypto from "crypto";
import AppError from "../utils/app.error.js";
import Jwt from "../utils/jwt.js";
import catchAsync from "../utils/catch.async.js";
import sendEmail from "../utils/email.js";
import sendToken from "../utils/token.js";
import User from "../models/user.model.js";
import filterObject from "../utils/filterObject.js";

const { JWT_EXPIRES_IN, JWT_SECRET } = process.env;
const jwt = new Jwt(JWT_SECRET, JWT_EXPIRES_IN);

export const signUp = catchAsync(async (req, res, next) => {
  if (await User.findOne({ email: req.body.email }).lean()) {
    return next(new AppError("User already exists", 400));
  }
  const userData = filterObject(
    req.body,
    "email",
    "name",
    "password",
    "passwordConfirm",
    "photo",
    "gender",
    "role",
  );

  const user = await User.create(userData, {});

  await sendToken(user, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password is required"), 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Password or email is incorrect", 400));
  }

  user.password = undefined; // password is not sent in the response

  await sendToken(user, 200, res);
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

  const decoded = await jwt.verify(token); // this will throw an error if the promise fails which will be handled in the global error handler

  const user = await User.findById(decoded.payload);

  if (!user) {
    return next(
      new AppError("The user belonging to this token no longer exits", 401),
    );
  }

  if (user.passwordChangedAfterJwt(decoded.iat)) {
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

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get the user email and check if user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email", 404));
  }

  // 2) Generate and send a resetToken
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send the resetToken to the user
  try {
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to:\n ${resetUrl}.\nIf you didn't forget your password, please ignore this email!.`;

    await sendEmail({
      email: user.email,
      subject: "Your password reset token(Valid for only 5 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email successfully!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error while resetting your password", 500),
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  // 1) Get User based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({ passwordResetToken: hashedToken });

  // 2) If the token has not expired and a user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or expired", 400));
  }

  if (await user.comparePassword(password, user.password)) {
    return next(
      new AppError(
        "New password cannot be the same as the current password",
        400,
      ),
    );
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Log the user in
  sendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Confirm password
  const { passwordCurrent, password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm || !passwordCurrent) {
    return next(
      new AppError(
        "You must provide a current password, password and password confirm",
        400,
      ),
    );
  }
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.comparePassword(passwordCurrent, user.password))) {
    return next(new AppError("Current password is incorrect"), 401);
  }

  if (await user.comparePassword(password, user.password)) {
    return next(
      new AppError(
        "New password cannot be the same as the current password",
        400,
      ),
    );
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  user.password = undefined; // password should not be sent to the client

  sendToken(user, 200, res);
});
