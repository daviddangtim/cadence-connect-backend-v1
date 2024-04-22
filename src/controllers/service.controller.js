import catchAsync from "../utils/catch.async.js";
import Service from "../models/service.model.js";
import AppError from "../utils/app.error.js";
import AppQueries from "../utils/app.queries.js";

export const createService = catchAsync(async (req, res, next) => {
  const newService = await Service.create({
    cacVerified: req.body.cacVerified, // TODO: THIS SHOULD BE REMOVED FOR PROD.
    categories: req.body.categories,
    description: req.body.description,
    emergency: req.body.emergency,
    coverImage: req.body.coverImage,
    images: req.body.images,
    location: req.body.location,
    maxBudget: req.body.maxBudget,
    minBudget: req.body.minBudget,
    name: req.body.name,
    ratingsAverage: req.body.ratingsAverage,
    ratingsQuantity: req.body.ratingsQuantity,
    schedule: req.body.schedule,
    summary: req.body.summary,
  });

  res.status(200).json({
    status: "success",
    data: { newService },
  });
});

export const getAllServices = catchAsync(async (req, res, next) => {
  const servicesQueries = new AppQueries(req.query, Service.find())
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const services = await servicesQueries.query;

  res.status(200).json({
    status: "success",
    result: services.length,
    data: { services },
  });
  // const services = await Service.find();
});

export const getService = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const service = await Service.findById(id, {}, { lean: true });

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

  const updatedService = await Service.findByIdAndUpdate(id, updatedFields);

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
