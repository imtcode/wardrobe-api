import { Router } from "express";
import { notesController } from "./notes.controller";
import { validateBody, validateParams, validateQuery } from "@/src/middlewares/validate";
import { createNoteSchema, notesParamsSchema, notesQuerySchema, updateNoteSchema } from "./notes.validation";

const notesRouter = Router();

notesRouter.get("/", validateQuery(notesQuerySchema), notesController.getAllNotes);
notesRouter.get("/:id", validateParams(notesParamsSchema), notesController.getSingleNote);
notesRouter.post("/", validateBody(createNoteSchema), notesController.createNote);
notesRouter.put("/:id", validateParams(notesParamsSchema), validateBody(updateNoteSchema), notesController.updateNote);
notesRouter.delete("/:id", validateParams(notesParamsSchema), notesController.deleteNote);

export default notesRouter;
