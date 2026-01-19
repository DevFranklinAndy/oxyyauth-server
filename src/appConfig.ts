import express, { type Express, type Request, type Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import envConfig from "./configurations/envConfiguration.ts";
import globalErrorHandler from "./errors/globalErrorHandler.ts";
import AppError from "./errors/appError.ts";
import authRoutes from "./routes/authRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";

const appConfig = (app: Express) => {
  app
    .use(cors({ credentials: true, origin: ["http://localhost:5173"] }))
    .use(helmet())
    .use(express.json())
    .use(cookieParser());

  if (envConfig.NODE_ENV === "development") app.use(morgan("dev"));

  app.get("/", (req: Request, res: Response) =>
    res.status(200).json({ message: "Oxyy API is live!" }),
  );

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/user", userRoutes);

  app.use((req, _res, next) =>
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)),
  );

  app.use(globalErrorHandler);
};

export default appConfig;
