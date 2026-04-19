import prisma from "@/src/lib/prisma";
import AppError from "@/src/lib/AppError";
import { statusCodes } from "@/src/constants/statusCodes";
import { EntityType } from "@/generated/prisma/client";
import paginate from "@/src/lib/paginate";

async function getAllNotes(filters: { entityType?: EntityType; entityId?: number; page?: number; limit?: number }) {
  const { entityType, entityId, page = 1, limit = 20 } = filters;

  const where = {
    type: "NOTE" as const,
    ...(entityType && { entityType }),
    ...(entityId && { entityId }),
  };

  const [notes, total] = await prisma.$transaction([
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: true },
    }),
    prisma.activityLog.count({ where }),
  ]);

  return { notes, pagination: paginate(total, page, limit) };
}

async function getSingleNoteById(id: number) {
  const note = await prisma.activityLog.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!note || note.type !== "NOTE") throw new AppError("Note not found", statusCodes.NOT_FOUND);

  return note;
}

async function createNote(userId: number, data: { entityType: EntityType; entityId: number; message: string }) {
  return await prisma.activityLog.create({
    data: {
      type: "NOTE",
      userId,
      ...data,
    },
    include: { user: true },
  });
}

async function updateNote(id: number, userId: number, message: string) {
  const note = await getSingleNoteById(id);

  if (note.userId !== userId) throw new AppError("You can only edit your own notes", statusCodes.FORBIDDEN);

  return await prisma.activityLog.update({
    where: { id },
    data: { message },
    include: { user: true },
  });
}

async function deleteNote(id: number, userId: number) {
  const note = await getSingleNoteById(id);

  if (note.userId !== userId) throw new AppError("You can only delete your own notes", statusCodes.FORBIDDEN);

  await prisma.activityLog.delete({ where: { id } });
}

export const notesService = {
  getAllNotes,
  getSingleNoteById,
  createNote,
  updateNote,
  deleteNote,
};
