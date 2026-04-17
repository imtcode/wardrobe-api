import { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";
import sendResponse from "@/src/lib/sendResponse";
import { statusCodes } from "@/src/constants/statusCodes";
import { Role } from "@/generated/prisma/client";

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
    const user = await userService.createUser(req.body);
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
    const user = await userService.updateUser(Number(id), req.body);
    return sendResponse({ res, status: true, message: "User updated successfully", data: user });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await userService.deleteUser(Number(id));
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
