import express from "express";
import {
  createService,
  deleteService,
  getAllCacVerifiedServices,
  getAllServicesByEmergencyStatus,
  getAllServices,
  getAllServicesByRating,
  getService,
  updateService,
} from "../controllers/service.controller.js";
import { protect } from "../controllers/auth.controller.js";

const router = express.Router();
router.route("/").post(createService).get(protect, getAllServices);
router.route("/:id").get(getService).patch(updateService).delete(deleteService);
router.route("/alias/top-rated").get(getAllServicesByRating, getAllServices);
router
  .route("alias/emergency")
  .get(getAllServicesByEmergencyStatus, getAllServices);
router
  .route("alias/cac-verified")
  .get(getAllCacVerifiedServices, getAllServices);
export default router;
