import prisma from "@/src/lib/prisma";
import { EntityType, LogType } from "@/generated/prisma/client";

interface CreateLogParams {
  type: LogType;
  entityType: EntityType;
  entityId: number;
  userId: number;
  message: string;
}

async function createLog({ type, entityType, entityId, userId, message }: CreateLogParams) {
  await prisma.activityLog.create({
    data: {
      type,
      entityType,
      entityId,
      userId,
      message,
    },
  });
}

export default createLog;
