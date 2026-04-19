import { z } from "zod";

export const activityLogQuerySchema = z.object({
  type: z.enum(["SYSTEM", "NOTE"]).optional(),
  entityType: z.enum(["ITEM", "LOCATION", "CATEGORY", "USER"]).optional(),
  entityId: z.coerce.number().optional(),
  userId: z.coerce.number().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});
