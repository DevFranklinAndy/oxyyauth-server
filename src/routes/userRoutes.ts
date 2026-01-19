import { Router } from "express";
import { authenticate, getAuth } from "../middleware/authenticate.ts";
import { getUser } from "../controllers/userController.ts";

const userRoutes = Router();

userRoutes.use(authenticate);

userRoutes.get("/", getAuth, getUser);

export default userRoutes;
