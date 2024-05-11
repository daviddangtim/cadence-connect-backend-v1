/* eslint-disable prettier/prettier */
import Jwt from "./jwt.js";

const { JWT_EXPIRES_IN, JWT_SECRET } = process.env;
const jwt = new Jwt(JWT_SECRET, JWT_EXPIRES_IN);

export default async (user, statusCode, res) => {
  const token = await jwt.sign(user._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 15 * 24 *60 *60 *1000,
});
};

export const sendCookie = async (user, statusCode, req, res, next) => {
  
  const token = await jwt.sign(user._id);

  // Set cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });

  // Attach token to response locals
  res.locals.token = token;

  // Generate token and send cookie
  await sendCookie(user, 200, req, res, next);

  // Send user data in response
  res.status(200).json({
    status: "success",
    token: res.locals.token, // Retrieve token from locals
    data: { user },
  });

  // Call next middleware
  next();
};