import User from "../models/user.model.js";

const text = (fn) => (req, res, next) => fn(req, res, next).catch(next);

export const textUser = (req, res, next) => {
  function sample(req, res, next) {}

  text((sample, req, res, next));
};

export const getUser = text(async (req, res, next) => {
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
