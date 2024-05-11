/* eslint-disable prettier/prettier */
import express from "express";
import {
  forgotPassword,
  login,
  signUp,
  resetPassword,
  updatePassword,
  protect,
} from "../controllers/auth.controller.js";
import { updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/sign-up", signUp);
router.post("/update-user",protect, updateUser)
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/update-password", protect, updatePassword);

export default router;
