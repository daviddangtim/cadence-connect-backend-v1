import AppError from "../utils/app.error.js";
import AppQueries from "../utils/app.queries.js";
import catchAsync from "../utils/catch.async.js";
import filterObject from "../utils/filterObject.js";
import Service from "../models/service.model.js";

export const createService = catchAsync(async (req, res, next) => {
  const serviceData = filterObject(
    req.body,
    "cacVerified", // FIXME: THIS SHOULD BE REMOVED FOR PROD.
    "categories",
    "description",
    "emergency",
    "coverImage",
    "images",
    "location",
    "maxBudget",
    "minBudget",
    "name",
    "ratingsAverage",
    "ratingsQuantity",
    "schedule",
    "summary",
  );
  const newService = await Service.create(serviceData).exec();

  res.status(200).json({
    status: "success",
    data: { newService },
  });
});

export const getAllServices = catchAsync(() => {});

export const getService = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const service = await Service.findById(id, {}, { lean: true }).exec();

  if (!service) {
    return next(new AppError(`No service was found with this id: ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: { service },
  });
});

export const updateService = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const excludedFields = ["cacVerified", "createdAt", "updatedAt"];
  const updatedFields = { ...req.body };

  // removing fields that should not be updated by the client
  excludedFields.forEach((field) => delete updatedFields[field]);

  const updatedService = await Service.findByIdAndUpdate(id, updatedFields, {
    includeResultMetadata: true,
    lean: true,
  }).exec();

  if (!updatedService) {
    return next(new AppError(`No service was found with this id: ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: { updatedService },
  });
});

export const deleteService = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedService = await Service.findByIdAndDelete(id, { lean: true });

  if (!deletedService) {
    return next(new AppError(`No service was found with this id: ${id}`, 404));
  }

  res.status(204).end();
});
