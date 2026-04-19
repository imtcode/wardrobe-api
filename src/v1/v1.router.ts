import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import authRouter from "@/src/v1/modules/auth/auth.routes";
import userRouter from "@/src/v1/modules/user/user.routes";
import locationRouter from "./modules/location/location.routes";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use(authenticate);
v1Router.use("/users", userRouter);
v1Router.use("/locations", locationRouter);

export default v1Router;
