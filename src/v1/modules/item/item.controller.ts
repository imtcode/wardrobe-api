import { Request, Response, NextFunction } from "express";
import { itemService } from "./item.service";
import sendResponse from "@/src/lib/sendResponse";
import { statusCodes } from "@/src/constants/statusCodes";
import { Condition, EntityType, LogType } from "@/generated/prisma/client";
import createLog from "@/src/lib/createLog";

async function getAllItems(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, categoryId, locationId, condition, color, page, limit, orderBy, orderByField } = req.query;

    const result = await itemService.getAllItems({
      search: search as string,
      categoryId: categoryId ? Number(categoryId) : undefined,
      locationId: locationId ? Number(locationId) : undefined,
      condition: condition as Condition,
      color: color as string,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      orderBy: orderBy as "asc" | "desc",
      orderByField: orderByField as "createdAt" | "name" | "brand" | "condition",
    });

    return sendResponse({ res, status: true, message: "Items fetched successfully", data: result });
  } catch (err) {
    next(err);
  }
}

async function getSingleItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const item = await itemService.getSingleItemById(Number(id));
    return sendResponse({ res, status: true, message: "Item fetched successfully", data: item });
  } catch (err) {
    next(err);
  }
}

async function createItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: userId } = req.user;

    const item = await itemService.createItem(req.body);
    await createLog({
      type: LogType.SYSTEM,
      entityType: EntityType.ITEM,
      entityId: item.id,
      userId,
      message: `Created Item ${item.name}`,
    });

    return sendResponse({ res, status: true, message: "Item created successfully", data: item, statusCode: statusCodes.CREATED });
  } catch (err) {
    next(err);
  }
}

async function updateItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const item = await itemService.updateItem(Number(id), req.body);

    await createLog({
      type: LogType.SYSTEM,
      entityType: EntityType.ITEM,
      entityId: item.id,
      userId,
      message: `Updated Item ${item.name}`,
    });
    return sendResponse({ res, status: true, message: "Item updated successfully", data: item });
  } catch (err) {
    next(err);
  }
}

async function deleteItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const item = await itemService.deleteItem(Number(id));

    await createLog({
      type: LogType.SYSTEM,
      entityType: EntityType.ITEM,
      entityId: Number(id),
      userId,
      message: `Deleted Item ${item.name}`,
    });

    return sendResponse({ res, status: true, message: "Item deleted successfully" });
  } catch (err) {
    next(err);
  }
}

// Other controllers
async function moveItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { locationId } = req.body;

    const { updatedItem, oldLocation, newLocation } = await itemService.moveItem(Number(id), locationId);

    await createLog({
      type: LogType.SYSTEM,
      entityType: EntityType.ITEM,
      entityId: updatedItem.id,
      userId: req.user.id,
      message: `Item "${updatedItem.name}" moved from "${oldLocation?.name ?? "Unknown"}" to "${newLocation.name}"`,
    });

    return sendResponse({ res, status: true, message: "Item moved successfully", data: updatedItem });
  } catch (err) {
    next(err);
  }
}

export const itemController = {
  getAllItems,
  getSingleItem,
  createItem,
  updateItem,
  deleteItem,

  // Other controllers
  moveItem,
};
