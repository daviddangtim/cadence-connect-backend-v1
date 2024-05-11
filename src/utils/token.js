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