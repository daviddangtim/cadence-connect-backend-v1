import Service from "../models/service.model.js";

export async function createService(req, res) {
  try {
    const newService = await Service.create(req.body);
    res.status(201).json({
      status: "success",
      data: { newService },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent " + e.message,
    });
  }
}
export async function getService(req, res) {}
export async function updateService(req, res) {}
export async function deleteService(req, res) {}
export async function getAllServices(req, res) {}
export async function getAllServicesByRating(req, res, next) {}
export async function getAllServicesByEmergencyStatus(req, res, next) {}
export async function getAllCacVerifiedServices(req, res, next) {}
