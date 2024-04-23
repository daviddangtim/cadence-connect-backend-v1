import crypto from "crypto";
import AppError from "../utils/app.error.js";
import Jwt from "../utils/jwt.js";
import catchAsync from "../utils/catch.async.js";
import sendEmail from "../utils/email.js";
import User from "../models/user.model.js";

const { JWT_EXPIRES_IN, JWT_SECRET } = process.env;
const jwt = new Jwt(JWT_SECRET, JWT_EXPIRES_IN);

export const signUp = catchAsync(async (req, res, next) => {
  if (await User.findOne({ email: req.body.email }).lean()) {
    return next(new AppError("User already exists", 400));
  }

  const user = await User.create({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.body.photo,
    role: req.body.role, // TODO: make sure this is removed in PROD.
    passwordChangedAt: req.body.passwordChangedAt, // TODO: make sure this is removed in PROD.
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

  const decoded = await jwt.verify(token); // this will throw an error if the promise fails which will be handled in the global error handler

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

    return next(
      new AppError("There was an error while resetting your password", 500),
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get User based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({ passwordResetToken: hashedToken });

  // 2) If token has not expired and a user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  console.log(user);

  // 3) Log the user in
  const token = await jwt.sign(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});
