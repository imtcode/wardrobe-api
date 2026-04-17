import { Router } from "express";
import { userController } from "./user.controller";
import { authorize } from "@/src/middlewares/authorize";
import { validateBody, validateParams, validateQuery } from "@/src/middlewares/validate";
import { createUserSchema, updateUserSchema, userParamsSchema, userQuerySchema } from "./user.validation";

const userRouter = Router();

userRouter.get("/", authorize("ADMIN"), validateQuery(userQuerySchema), userController.getAllUsers);
userRouter.get("/:id", authorize("ADMIN"), validateParams(userParamsSchema), userController.getSingleUser);
userRouter.post("/", authorize("ADMIN"), validateBody(createUserSchema), userController.createUser);
userRouter.put("/:id", authorize("ADMIN"), validateBody(updateUserSchema), validateParams(userParamsSchema), userController.updateUser);
userRouter.delete("/:id", authorize("ADMIN"), validateParams(userParamsSchema), userController.deleteUser);

export default userRouter;
