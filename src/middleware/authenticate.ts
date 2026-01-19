import type { NextFunction, Request, Response } from "express";
import catchAsync from "../helpers/catchAsync.ts";
import AppError from "../errors/appError.ts";
import jwt from "jsonwebtoken";
import envConfig from "../configurations/envConfiguration.ts";
import userModel from "../models/userModel.ts";

export const authenticate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    let token: string | undefined;
    if (authorization && authorization.startsWith("Bearer "))
      token = authorization.split(" ")[1];
    else if (req.cookies?.jwt) token = req.cookies.jwt;

    if (!token)
      return next(
        new AppError("You are not logged in. Please log in again!", 401)
      );

    const { id } = jwt.verify(token, envConfig.JWT_TOKEN_SECRET) as {
      id: string;
    };

    const currentUser = await userModel.findById(id);

    if (!currentUser)
      return next(
        new AppError("This User no longer exists on our record.", 404)
      );

    (req as any).user = currentUser;

    next();
  }
);

export const getAuth = (req: Request, _res: Response, next: NextFunction) => {
  req.params.id = (req as any).user._id;
  next();
};
