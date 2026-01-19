import catchAsync from "../helpers/catchAsync.ts";
import userModel from "../models/userModel.ts";
import type { NextFunction, Request, Response } from "express";
import { compare, hash } from "bcryptjs";
import { Resend } from "resend";
import envConfig from "../configurations/envConfiguration.ts";
import jwt from "jsonwebtoken";
import AppError from "../errors/appError.ts";
import OTP_EMAIL_TEMPLATE from "../templates/otpEmail.ts";
import RESET_PASSWORD_EMAIL from "../templates/resetPasswordEmail.ts";
import type { StringValue } from "ms";

const resend = new Resend(envConfig.RESEND_API_KEY);

// Generate JWT Token
const generateToken = (
  id: string,
  expiresIn: StringValue | number = "15m",
): string =>
  jwt.sign({ id }, envConfig.JWT_TOKEN_SECRET, {
    expiresIn,
  });

// Register
export const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password)
      return next(
        new AppError(
          "Kindly fill in the required information (Full Name, Email & Password)",
          400,
        ),
      );

    if (password.length < 6)
      return next(
        new AppError("Password must be at least 6 characters long", 422),
      );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await hash(otp, 10);

    const user = new userModel({
      fullname,
      email,
      password,
      otp: hashedOtp,
    });

    const otpToken = generateToken(user._id.toString());

    const otpLink = `${envConfig.CLIENT_URL}/otp/${otpToken}`;

    // Send OTP Mail
    const { error, data } = await resend.emails.send({
      from: `Oxyy <${envConfig.RESEND_EMAIL}>`,
      to: email,
      subject: "OTP Verification",
      html: OTP_EMAIL_TEMPLATE.replace("{{firstname}}", fullname.split(" ")[0])
        .replace("{{otp}}", otp)
        .replace("{{otpLink}}", otpLink),
    });

    if (error) {
      return next(
        new AppError(
          "Unable to send email verification mail! Kindly retry your registration.",
          400,
        ),
      );
    } else console.log(data);

    await user.save();
    res.status(201).json({
      status: "success",
      message:
        "You have successfully registered. Go to your mail to verify email with OTP!",
    });
  },
);

// Verify Email using OTP
export const emailVerification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { otpToken } = req.params;
    const { otp } = req.body;
    const { id: userId } = jwt.verify(
      otpToken as string,
      envConfig.JWT_TOKEN_SECRET,
    ) as { id: string };

    const user = await userModel.findById(userId);

    if (!user)
      return next(new AppError("User doesn't exist on our record.", 400));

    if (user.emailVerified)
      return next(new AppError("User Email is already verified.", 409));

    if (!(await compare(otp, user.otp!)))
      return next(new AppError("Invalid OTP provided. Please try again!", 401));

    user.emailVerified = true;
    user.otp = undefined;
    await user.save();

    res
      .status(200)
      .json({ status: "success", message: "Email verified successfully." });
  },
);

// Resend New OTP
export const resendNewOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const user = await userModel.findById(userId);

    if (!user)
      return next(new AppError("User doesn't exist on our record.", 400));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await hash(otp, 10);

    user.otp = hashedOtp;
    await user.save();

    const otpToken = generateToken(userId as string);

    const otpLink = `${envConfig.CLIENT_URL}/otp/${otpToken}`;

    await resend.emails.send({
      from: `Oxyy <${envConfig.RESEND_EMAIL}>`,
      to: user.email,
      subject: "OTP Verification",
      html: OTP_EMAIL_TEMPLATE.replace(
        "{{firstname}}",
        user.fullname.split(" ")[0] as string,
      )
        .replace("{{otp}}", otp)
        .replace("{{otpLink}}", otpLink),
    });

    res
      .status(200)
      .json({ status: "success", message: "OTP mail resent successfully!" });
  },
);

// Login
export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user)
      return next(new AppError("User doesn't exist on our record.", 404));

    if (!user.emailVerified)
      return next(new AppError("User email is not verified.", 401));

    if (!(await compare(password, user.password!)))
      return next(new AppError("Invalid password provided!", 401));

    const token = generateToken(user._id.toString(), "1d");

    res.cookie("jwt", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: envConfig.NODE_ENV === "production",
      sameSite: envConfig.NODE_ENV === "production" ? "none" : "strict",
      httpOnly: true,
    });

    user.otp = undefined;
    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "Successfully logged in to Oxyy account.",
      token,
      data: { user },
    });
  },
);

// Forgot Password
export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user)
      return next(new AppError("User doesn't exist on our record", 404));

    if (!user.emailVerified)
      return next(new AppError("User email is not verified.", 401));

    const resetToken = generateToken(user._id.toString());

    const resetLink = `${envConfig.CLIENT_URL}/reset-password/${resetToken}`;

    // Send Reset Password Mail
    await resend.emails.send({
      from: `Oxyy <${envConfig.RESEND_EMAIL}>`,
      to: email,
      subject: "Reset Password OTP",
      html: RESET_PASSWORD_EMAIL.replace(
        "{{firstname}}",
        user.fullname.split(" ")[0] as string,
      ).replace("{{resetLink}}", resetLink),
    });

    res.status(200).json({
      status: "success",
      message: "Password reset mail sent successfully!",
    });
  },
);

// Reset Password
export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { resetToken } = req.params;
    const { password } = req.body;
    const { id: userId } = jwt.verify(
      resetToken as string,
      envConfig.JWT_TOKEN_SECRET,
    ) as { id: string };

    const user = await userModel.findById(userId);

    if (!user)
      return next(new AppError("User doesn't exist on our record", 404));

    if (!user.emailVerified)
      return next(new AppError("User email is not verified.", 401));

    user.password = password;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successfully.",
    });
  },
);

// Logout
export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: envConfig.NODE_ENV === "production" ? "none" : "strict",
      secure: envConfig.NODE_ENV === "production",
    });

    res
      .status(200)
      .json({ status: "success", message: "Logged out successfully!" });
  },
);
