import { Router } from "express";
import { authenticate } from "@/src/middlewares/authenticate";
import authRouter from "@/src/v1/modules/auth/auth.routes";
import userRouter from "@/src/v1/modules/user/user.routes";
import masterRouter from "@/src/v1/modules/master/master.routes";
import itemRouter from "@/src/v1/modules/item/items.routes";
import activityLogRouter from "@/src/v1/modules/activity-log/activity-log.routes";
import notesRouter from "@/src/v1/modules/notes/notes.routes";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use(authenticate);
v1Router.use("/users", userRouter);
v1Router.use("/master", masterRouter);
v1Router.use("/items", itemRouter);
v1Router.use("/activity-logs", activityLogRouter);
v1Router.use("/notes", notesRouter);

export default v1Router;
