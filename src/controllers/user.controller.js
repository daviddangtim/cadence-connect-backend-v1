/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
import User from "../models/user.model.js";
import catchAsync from "../utils/catch.async.js";



export const getUser = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findById(req.body.id);

    if (!user) {
      res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});
