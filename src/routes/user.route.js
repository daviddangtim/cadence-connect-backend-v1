import express from "express";
import {
  forgotPassword,
  login,
  signUp,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/sign-up", signUp);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

export default router;
