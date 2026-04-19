import { z } from "zod";

export const locationParamsSchema = z.object({
  id: z.coerce.number({ error: "Invalid ID" }),
});

export const locationQuerySchema = z.object({
  search: z.string().optional(),
});

export const createLocationSchema = z.object({
  name: z.string({ error: "Name is required" }).min(1, "Name is required"),
  parentId: z.number().optional().nullable(),
});

export const updateLocationSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  parentId: z.number().optional().nullable(),
});
