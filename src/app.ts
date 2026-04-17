import express from "express";
import cors from "cors";
import v1Router from "@/src/v1/v1.router";
import errorHandler from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", v1Router);

app.use(errorHandler);

export default app;
