import { Router } from "express";
import { categoryController } from "./category.controller";
import { validateBody, validateParams, validateQuery } from "@/src/middlewares/validate";
import { createCategorySchema, categoryParamsSchema, categoryQuerySchema, updateCategorySchema } from "./category.validation";
import { authorize } from "@/src/middlewares/authorize";

const categoryRouter = Router();

categoryRouter.get("/", validateQuery(categoryQuerySchema), categoryController.getAllCategories);
categoryRouter.get("/:id", validateParams(categoryParamsSchema), categoryController.getSingleCategory);
categoryRouter.post("/", authorize("ADMIN"), validateBody(createCategorySchema), categoryController.createCategory);
categoryRouter.put("/:id", authorize("ADMIN"), validateParams(categoryParamsSchema), validateBody(updateCategorySchema), categoryController.updateCategory);
categoryRouter.delete("/:id", authorize("ADMIN"), validateParams(categoryParamsSchema), categoryController.deleteCategory);

export default categoryRouter;
