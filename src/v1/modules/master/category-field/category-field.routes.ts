import { Router } from "express";
import { categoryFieldController } from "./category-field.controller";
import { authorize } from "@/src/middlewares/authorize";
import { validateBody, validateParams, validateQuery } from "@/src/middlewares/validate";
import { categoryFieldParamsSchema, categoryFieldQuerySchema, createCategoryFieldSchema, updateCategoryFieldSchema } from "./category-field.validation";

const categoryFieldRouter = Router();

categoryFieldRouter.get("/", validateQuery(categoryFieldQuerySchema), categoryFieldController.getAllCategoryFields);
categoryFieldRouter.get("/:id", validateParams(categoryFieldParamsSchema), categoryFieldController.getSingleCategoryField);
categoryFieldRouter.post("/", authorize("ADMIN"), validateBody(createCategoryFieldSchema), categoryFieldController.createCategoryField);
categoryFieldRouter.put("/:id", authorize("ADMIN"), validateParams(categoryFieldParamsSchema), validateBody(updateCategoryFieldSchema), categoryFieldController.updateCategoryField);
categoryFieldRouter.delete("/:id", authorize("ADMIN"), validateParams(categoryFieldParamsSchema), categoryFieldController.deleteCategoryField);

export default categoryFieldRouter;
