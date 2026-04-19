import { Router } from "express";
import { locationController } from "./location.controller";
import { validateBody, validateParams, validateQuery } from "@/src/middlewares/validate";
import { createLocationSchema, locationParamsSchema, locationQuerySchema, updateLocationSchema } from "./location.validation";

const locationRouter = Router();

locationRouter.get("/", validateQuery(locationQuerySchema), locationController.getAllLocations);
locationRouter.get("/:id", validateParams(locationParamsSchema), locationController.getSingleLocation);
locationRouter.post("/", validateBody(createLocationSchema), locationController.createLocation);
locationRouter.put("/:id", validateParams(locationParamsSchema), validateBody(updateLocationSchema), locationController.updateLocation);
locationRouter.delete("/:id", validateParams(locationParamsSchema), locationController.deleteLocation);

export default locationRouter;
