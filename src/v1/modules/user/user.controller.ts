import { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";
import sendResponse from "@/src/lib/sendResponse";
import { statusCodes } from "@/src/constants/statusCodes";
import { EntityType, Role } from "@/generated/prisma/client";
import createLog from "@/src/lib/createLog";
import { LogType } from "@/generated/prisma/client";

async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, role, page, limit, orderBy, orderByField } = req.query;

    const result = await userService.getAllUsers({
      search: search as string,
      role: role as Role,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      orderBy: orderBy as "asc" | "desc",
      orderByField: orderByField as "createdAt" | "name",
    });

    return sendResponse({ res, status: true, message: "Users fetched successfully", data: result });
  } catch (err) {
    next(err);
  }
}

async function getSingleUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await userService.getSingleUserById(Number(id));
    return sendResponse({ res, status: true, message: "User fetched successfully", data: user });
  } catch (err) {
    next(err);
  }
}

async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: userId } = req.user;
    const user = await userService.createUser(req.body);

    await createLog({
      type: LogType.SYSTEM,
      entityType: EntityType.USER,
      entityId: user.id,
      userId,
      message: `Created User ${user.name} with role ${user.role}`,
    });

    return sendResponse({
      res,
      status: true,
      message: "User created successfully",
      data: user,
      statusCode: statusCodes.CREATED,
    });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const user = await userService.updateUser(Number(id), req.body);

    await createLog({
      type: LogType.SYSTEM,
      entityType: EntityType.USER,
      entityId: user.id,
      userId,
      message: `Updated User ${user.name}`,
    });
    return sendResponse({ res, status: true, message: "User updated successfully", data: user });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const user = await userService.deleteUser(Number(id));

    await createLog({
      type: LogType.SYSTEM,
      entityType: EntityType.USER,
      entityId: Number(id),
      userId,
      message: `Deleted User ${user.name}`,
    });

    return sendResponse({ res, status: true, message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
}

export const userController = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};
