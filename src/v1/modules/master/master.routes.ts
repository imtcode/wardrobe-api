import { Router } from "express";
import locationRouter from "@/src/v1/modules/master/location/location.routes";
import categoryRouter from "@/src/v1/modules/master/category/category.routes";
import categoryFieldRouter from "@/src/v1/modules/master/category-field/category-field.routes";

const masterRouter = Router();

masterRouter.use("/locations", locationRouter);
masterRouter.use("/categories", categoryRouter);
masterRouter.use("/category-fields", categoryFieldRouter);

export default masterRouter;
