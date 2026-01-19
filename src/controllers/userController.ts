import type { NextFunction, Request, Response } from "express";
import catchAsync from "../helpers/catchAsync.ts";
import userModel from "../models/userModel.ts";
import AppError from "../errors/appError.ts";

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findById(req.params.id);

    if (!user)
      return next(new AppError("User doesn't exist on our record.", 404));

    res.status(200).json({ status: "success", data: { user } });
  }
);
