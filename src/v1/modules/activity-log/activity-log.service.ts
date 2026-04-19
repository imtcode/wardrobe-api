import prisma from "@/src/lib/prisma";
import paginate from "@/src/lib/paginate";
import { EntityType, LogType } from "@/generated/prisma/client";

async function getAllLogs(filters: { type?: LogType; entityType?: EntityType; entityId?: number; userId?: number; fromDate?: Date; toDate?: Date; page?: number; limit?: number }) {
  const { type, entityType, entityId, userId, fromDate, toDate, page = 1, limit = 20 } = filters;

  const where = {
    ...(type && { type }),
    ...(entityType && { entityType }),
    ...(entityId && { entityId }),
    ...(userId && { userId }),
    ...(fromDate || toDate
      ? {
          createdAt: {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate }),
          },
        }
      : {}),
  };

  const [logs, total] = await prisma.$transaction([
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: true },
    }),
    prisma.activityLog.count({ where }),
  ]);

  return {
    logs,
    pagination: paginate(total, page, limit),
  };
}

export const activityLogService = {
  getAllLogs,
};
