import Service from "../models/service.model.js";
import catchAsync from "../utils/catch.async.js";
import AppQueries from "../utils/App.queries.js";
import AppError from "../utils/App.error.js";

export const createService = catchAsync(async (req, res, next) => {
  const service = new Service({
    name: req.body.name,
    cacVerified: req.body.cacVerified,
    datesAvailable: req.body.datesAvailable,
    categories: req.body.categories,
    description: req.body.description,
    handleEmergency: req.body.handleEmergency,
    imageCover: req.body.imageCover,
    images: req.body.images,
    location: req.body.location,
    maxBudget: req.body.maxBudget,
    minBudget: req.body.minBudget,
    ratingsAverage: req.body.ratingsAverage,
    ratingsQuantity: req.body.ratingsQuantity,
    summary: req.body.summary,
  });

  const newService = await service.save();
  res.status(201).json({
    status: "success",
    data: { newService },
  });
});

export const getService = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(
      new AppError(`No service found with id: ${req.params.id}`, 400),
    );
  }
  res.status(200).json({
    status: "success",
    data: { service },
  });
});

export const getAllServices = catchAsync(async (req, res, next) => {
  const appQueries = new AppQueries(req.query, Service.find())
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const services = await appQueries.query;
  res.status(200).json({
    status: "success",
    data: { length: services.length, services },
  });
});

export const updateService = catchAsync(async (req, res, next) => {
  if (!updateService) {
    return next(
      new AppError(`No service found with id: ${req.params.id}`, 400),
    );
  }

  const updatedService = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      includeResultMetadata: true,
      lean: true,
      new: true,
      runValidators: true,
      context: "query",
    },
  );

  res.status(200).json({
    status: "success",
    data: { updatedService },
  });
});

export const deleteService = catchAsync(async (req, res, next) => {
  const deletedService = await Service.findByIdAndDelete(
    req.params.id,
    req.body,
  );

  if (!deletedService) {
    return next(
      new AppError(`No service found with id: ${req.params.id}`, 400),
    );
  }
  res.status(204).end();
});

export const getAllServicesByRating = catchAsync(async (req, res, next) => {
  //SERVICES WITH LESS THAN 3.5 RATINGS AVERAGE WILL BE EXCLUDED
  req.query.sort = "-ratingsAverage,-ratingsQuantity";
  req.query.fields = "names, ratingsAverage, cacVerified, categories, summary";
  req.query.limit = 5;
  req.query.ratingsAverage = { gte: 3.5 };
  next();
});
export const getAllServicesByEmergencyStatus = catchAsync(
  async (req, res, next) => {},
);
export const getAllCacVerifiedServices = catchAsync(
  async (req, res, next) => {},
);
