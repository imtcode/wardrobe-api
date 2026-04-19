import { Router } from "express";
import { activityLogController } from "./activity-log.controller";
import { validateQuery } from "@/src/middlewares/validate";
import { activityLogQuerySchema } from "./activity-log.validation";
import { authorize } from "@/src/middlewares/authorize";

const activityLogRouter = Router();

activityLogRouter.get("/", authorize("ADMIN"), validateQuery(activityLogQuerySchema), activityLogController.getAllLogs);

export default activityLogRouter;
