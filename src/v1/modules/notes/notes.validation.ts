import { z } from "zod";

export const notesParamsSchema = z.object({
  id: z.coerce.number({ error: "Invalid ID" }),
});

export const notesQuerySchema = z.object({
  entityType: z.enum(["ITEM", "LOCATION", "CATEGORY", "USER"]).optional(),
  entityId: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export const createNoteSchema = z.object({
  entityType: z.enum(["ITEM", "LOCATION", "CATEGORY", "USER"], { error: "Invalid entity type" }),
  entityId: z.number({ error: "Entity ID is required" }),
  message: z.string({ error: "Message is required" }).min(1, "Message is required"),
});

export const updateNoteSchema = z.object({
  message: z.string({ error: "Message is required" }).min(1, "Message is required"),
});
