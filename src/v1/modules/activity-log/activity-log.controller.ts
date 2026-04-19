import { Request, Response, NextFunction } from "express";
import { activityLogService } from "./activity-log.service";
import sendResponse from "@/src/lib/sendResponse";
import { EntityType, LogType } from "@/generated/prisma/client";

async function getAllLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const { type, entityType, entityId, userId, fromDate, toDate, page, limit } = req.query;

    const result = await activityLogService.getAllLogs({
      type: type as LogType,
      entityType: entityType as EntityType,
      entityId: entityId ? Number(entityId) : undefined,
      userId: userId ? Number(userId) : undefined,
      fromDate: fromDate ? new Date(fromDate as string) : undefined,
      toDate: toDate ? new Date(toDate as string) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    return sendResponse({ res, status: true, message: "Logs fetched successfully", data: result });
  } catch (err) {
    next(err);
  }
}

export const activityLogController = {
  getAllLogs,
};
