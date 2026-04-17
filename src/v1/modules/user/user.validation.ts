import { z } from "zod";

export const userParamsSchema = z.object({
  id: z.coerce.number({ error: "Invalid ID" }),
});

export const userQuerySchema = z.object({
  search: z.string().optional(),
  role: z.enum(["ADMIN", "STAFF"]).optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  orderBy: z.enum(["asc", "desc"]).optional(),
  orderByField: z.enum(["createdAt", "name"]).optional(),
});

export const createUserSchema = z.object({
  name: z.string({ error: "Name is required" }).min(1, "Name is required"),
  email: z.email("Invalid email address"),
  mobile: z.string({ error: "Mobile is required" }).min(1, "Mobile is required"),
  role: z.enum(["ADMIN", "STAFF"], { error: "Invalid role" }),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  email: z.email("Invalid email address").optional(),
  mobile: z.string().min(1, "Mobile cannot be empty").optional(),
  role: z.enum(["ADMIN", "STAFF"]).optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});
