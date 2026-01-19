import { Router } from "express";
import {
  emailVerification,
  forgotPassword,
  loginUser,
  logout,
  registerUser,
  resendNewOTP,
  resetPassword,
} from "../controllers/authController.ts";

const authRoutes = Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/verify-otp/:otpToken", emailVerification);
authRoutes.post("/resend-otp/:userId", resendNewOTP);
authRoutes.post("/login", loginUser);
authRoutes.post("/send-reset-mail", forgotPassword);
authRoutes.post("/reset-password/:resetToken", resetPassword);
authRoutes.post("/logout", logout);

export default authRoutes;
