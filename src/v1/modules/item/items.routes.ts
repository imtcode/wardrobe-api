import { Router } from "express";
import { itemController } from "./item.controller";
import { validateBody, validateParams, validateQuery } from "@/src/middlewares/validate";
import { createItemSchema, itemParamsSchema, itemQuerySchema, moveItemSchema, updateItemSchema } from "./item.validation";

const itemRouter = Router();

itemRouter.get("/", validateQuery(itemQuerySchema), itemController.getAllItems);
itemRouter.get("/:id", validateParams(itemParamsSchema), itemController.getSingleItem);
itemRouter.post("/", validateBody(createItemSchema), itemController.createItem);
itemRouter.put("/:id", validateParams(itemParamsSchema), validateBody(updateItemSchema), itemController.updateItem);
itemRouter.delete("/:id", validateParams(itemParamsSchema), itemController.deleteItem);

// Other routes
itemRouter.post("/:id/move", validateParams(itemParamsSchema), validateBody(moveItemSchema), itemController.moveItem);

export default itemRouter;
