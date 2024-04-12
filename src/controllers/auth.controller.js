import catchAsync from "../utils/catch.async.js";
import User from "../models/user.model.js";

export const signup = catchAsync(async (req, res, next) => {
  const user = new User(req.body);
  const newUser = await user.save();

  res.status(200).json({
    status: "success",
    data: { newUser },
  });
});
