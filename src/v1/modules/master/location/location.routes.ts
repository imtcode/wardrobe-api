import { Router } from "express";
import { locationController } from "./location.controller";
import { validateBody, validateParams, validateQuery } from "@/src/middlewares/validate";
import { createLocationSchema, locationParamsSchema, locationQuerySchema, updateLocationSchema } from "./location.validation";
import { authorize } from "@/src/middlewares/authorize";

const locationRouter = Router();

locationRouter.get("/", validateQuery(locationQuerySchema), locationController.getAllLocations);
locationRouter.get("/:id", validateParams(locationParamsSchema), locationController.getSingleLocation);
locationRouter.post("/", authorize("ADMIN"), validateBody(createLocationSchema), locationController.createLocation);
locationRouter.put("/:id", authorize("ADMIN"), validateParams(locationParamsSchema), validateBody(updateLocationSchema), locationController.updateLocation);
locationRouter.delete("/:id", authorize("ADMIN"), validateParams(locationParamsSchema), locationController.deleteLocation);

export default locationRouter;
