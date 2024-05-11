/* eslint-disable prettier/prettier */
import express from "express";
import {
  createService,
  deleteService,
  getAllServices,
  getService,
  updateService,
} from "../controllers/service.controller.js";
import { protect, restrictTo } from "../controllers/auth.controller.js";
import upload from "../utils/imgUpload.js";

const router = express.Router();

router
  .route("/")
  .post(upload.single("coverImage"),createService)
   .get(protect, restrictTo("admin", "client"), getAllServices);
router.route("/:id").get(getService).patch(updateService).delete(deleteService);

export default router;
