import type { NextFunction, Request, Response } from "express";
import AppError from "./appError.ts";
import envConfig from "../configurations/envConfiguration.ts";
import type { Error as MongooseError } from "mongoose";

const handleTokenExpiredError = () =>
  new AppError("Token has expired! Generate a new OTP mail.", 400);

const handleTokenMalfunctionError = () =>
  new AppError("Invalid Token was provided! Try again.", 400);

const handleDuplicateKeyError = (error: any) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field!];
  const capitalizeField = field![0]?.toUpperCase() + field!.slice(1);

  return new AppError(
    `${capitalizeField} ${value} already exists on our record.`,
    409,
  );
};

const handleValidationError = (error: MongooseError.ValidationError) => {
  const messages = Object.values(error.errors).map((err) => err.message);
  return new AppError(messages.join(". "), 422);
};

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error: Error | AppError = err;

  if (!(error instanceof AppError)) {
    if (error.name === "TokenExpiredError") error = handleTokenExpiredError();
    if (error.name === "JsonWebTokenError")
      error = handleTokenMalfunctionError();
    if (error.name === "ValidationError")
      error = handleValidationError(error as MongooseError.ValidationError);
    if ((error as any).code === 11000) error = handleDuplicateKeyError(error);
  }

  if (error instanceof TypeError)
    return res.status(400).json({ status: "fail", message: error.message });

  if (envConfig.NODE_ENV === "development")
    return res.status(500).json({
      status: "error",
      message: error.message,
      stack: error.stack,
      error,
    });

  if (error instanceof AppError && error.isOperational)
    return res
      .status(error.statusCode)
      .json({ status: error.status || "error", message: error.message });

  console.error("UNEXPECTED_ERROR: ", error);

  return res
    .status(500)
    .json({ status: "error", message: "An error occured. Please try again!" });
};

export default globalErrorHandler;
