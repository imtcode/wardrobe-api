import { Request, Response, NextFunction } from "express";
import { notesService } from "./notes.service";
import sendResponse from "@/src/lib/sendResponse";
import { statusCodes } from "@/src/constants/statusCodes";
import { EntityType } from "@/generated/prisma/client";

async function getAllNotes(req: Request, res: Response, next: NextFunction) {
  try {
    const { entityType, entityId, page, limit } = req.query;

    const result = await notesService.getAllNotes({
      entityType: entityType as EntityType,
      entityId: entityId ? Number(entityId) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    return sendResponse({ res, status: true, message: "Notes fetched successfully", data: result });
  } catch (err) {
    next(err);
  }
}

async function getSingleNote(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const note = await notesService.getSingleNoteById(Number(id));
    return sendResponse({ res, status: true, message: "Note fetched successfully", data: note });
  } catch (err) {
    next(err);
  }
}

async function createNote(req: Request, res: Response, next: NextFunction) {
  try {
    const note = await notesService.createNote(req.user.id, req.body);
    return sendResponse({ res, status: true, message: "Note created successfully", data: note, statusCode: statusCodes.CREATED });
  } catch (err) {
    next(err);
  }
}

async function updateNote(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const note = await notesService.updateNote(Number(id), req.user.id, req.body.message);
    return sendResponse({ res, status: true, message: "Note updated successfully", data: note });
  } catch (err) {
    next(err);
  }
}

async function deleteNote(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await notesService.deleteNote(Number(id), req.user.id);
    return sendResponse({ res, status: true, message: "Note deleted successfully" });
  } catch (err) {
    next(err);
  }
}

export const notesController = {
  getAllNotes,
  getSingleNote,
  createNote,
  updateNote,
  deleteNote,
};
