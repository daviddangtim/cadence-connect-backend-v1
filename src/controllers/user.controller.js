/* eslint-disable prettier/prettier */

/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable import/prefer-default-export */
import User from "../models/user.model.js";
import catchAsync from "../utils/catch.async.js";
import AppError from "../utils/app.error.js";
import filterObject from "../utils/filterObject.js";




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

export const updateUser = catchAsync( async (req, res,next)=>{

    const {id} = req.params.id;
    
  const updatedFields = filterObject("name", "email", "gender")


  const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
    includeResultMetadata: true,
    lean: true,
  }).exec();

  if (!updatedUser) {
    return next(new AppError(`No service was found with this id: ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: { updatedUser },
  });


  
})
