import { z } from "zod";

export const itemParamsSchema = z.object({
  id: z.coerce.number({ error: "Invalid ID" }),
});

export const itemQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.coerce.number().optional(),
  locationId: z.coerce.number().optional(),
  condition: z.enum(["NEW", "GOOD", "FAIR", "POOR"]).optional(),
  color: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  orderBy: z.enum(["asc", "desc"]).optional(),
  orderByField: z.enum(["createdAt", "name", "brand", "condition"]).optional(),
});

export const createItemSchema = z.object({
  name: z.string({ error: "Name is required" }).min(1, "Name is required"),
  brand: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  condition: z.enum(["NEW", "GOOD", "FAIR", "POOR"]).optional().nullable(),
  categoryId: z.number().optional().nullable(),
  locationId: z.number().optional().nullable(),
  images: z.array(z.string()).optional().nullable(),
  fieldValues: z
    .array(
      z.object({
        fieldId: z.number(),
        value: z.string(),
      }),
    )
    .optional()
    .nullable(),
});

export const updateItemSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  brand: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  condition: z.enum(["NEW", "GOOD", "FAIR", "POOR"]).optional().nullable(),
  categoryId: z.number().optional().nullable(),
  locationId: z.number().optional().nullable(),
  images: z.array(z.string()).optional().nullable(),
  fieldValues: z
    .array(
      z.object({
        fieldId: z.number(),
        value: z.string(),
      }),
    )
    .optional()
    .nullable(),
});
