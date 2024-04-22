import express from "express";
import {
  createService,
  deleteService,
  getAllServices,
  getService,
  updateService,
} from "../controllers/service.controller.js";
import { protect, restrictTo } from "../controllers/auth.controller.js";

const router = express.Router();

router
  .route("/")
  .post(createService)
  .get(protect, restrictTo("user"), getAllServices);
router.route("/:id").get(getService).patch(updateService).delete(deleteService);

export default router;
