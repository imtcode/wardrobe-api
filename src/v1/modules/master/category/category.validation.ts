import { z } from "zod";

export const categoryParamsSchema = z.object({
  id: z.coerce.number({ error: "Invalid ID" }),
});

export const categoryQuerySchema = z.object({
  search: z.string().optional(),
});

export const createCategorySchema = z.object({
  name: z.string({ error: "Name is required" }).min(1, "Name is required"),
  parentId: z.number().optional().nullable(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  parentId: z.number().optional().nullable(),
});
