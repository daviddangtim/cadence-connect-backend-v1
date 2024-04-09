import Service from "../models/service.model.js";
import catchAsync from "../utils/catch.async.js";

export const createService = catchAsync(async (req, res, next) => {
  const newService = await Service.create(req.body);

  res.status(201).json({
    status: "success",
    data: { newService },
  });
});

export const getService = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: { service },
  });
});

export const getAllServices = catchAsync(async (req, res, next) => {
  const services = await Service.find({});

  res.status(200).json({
    status: "success",
    data: { length: services.length, services },
  });
});

export const updateService = catchAsync(async (req, res, next) => {
  const updatedService = await Service.findByIdAndUpdate(req.params.id);

  res.status(200).json({
    status: "success",
    data: { updatedService },
  });
});
export const deleteService = catchAsync(async (req, res, next) => {
  await Service.findByIdAndDelete(req.params.id);
  res.status(204).end();
});
export const getAllServicesByRating = catchAsync(async (req, res, next) => {});
export const getAllServicesByEmergencyStatus = catchAsync(
  async (req, res, next) => {},
);
export const getAllCacVerifiedServices = catchAsync(
  async (req, res, next) => {},
);
