import { z } from "zod";

export const categoryFieldParamsSchema = z.object({
  id: z.coerce.number({ error: "Invalid ID" }),
});

export const categoryFieldQuerySchema = z.object({
  categoryId: z.coerce.number().optional(),
  fieldType: z.enum(["TEXT", "NUMBER", "DATE", "SELECT"]).optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export const createCategoryFieldSchema = z.object({
  categoryId: z.number({ error: "Category ID is required" }),
  name: z.string({ error: "Name is required" }).min(1, "Name is required"),
  fieldType: z.enum(["TEXT", "NUMBER", "DATE", "SELECT"], { error: "Invalid field type" }),
  options: z.array(z.string()).optional().nullable(),
  isRequired: z.boolean({ error: "isRequired is required" }),
});

export const updateCategoryFieldSchema = z.object({
  name: z.string({ error: "Name cannot be empty" }).min(1, "Name cannot be empty").optional(),
  fieldType: z.enum(["TEXT", "NUMBER", "DATE", "SELECT"]).optional(),
  options: z.array(z.string()).optional().nullable(),
  isRequired: z.boolean().optional(),
});
