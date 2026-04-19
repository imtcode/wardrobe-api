import { Request, Response, NextFunction } from "express";
import { itemService } from "./item.service";
import sendResponse from "@/src/lib/sendResponse";
import { statusCodes } from "@/src/constants/statusCodes";
import { Condition } from "@/generated/prisma/client";

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
    const item = await itemService.createItem(req.body);
    return sendResponse({ res, status: true, message: "Item created successfully", data: item, statusCode: statusCodes.CREATED });
  } catch (err) {
    next(err);
  }
}

async function updateItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const item = await itemService.updateItem(Number(id), req.body);
    return sendResponse({ res, status: true, message: "Item updated successfully", data: item });
  } catch (err) {
    next(err);
  }
}

async function deleteItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await itemService.deleteItem(Number(id));
    return sendResponse({ res, status: true, message: "Item deleted successfully" });
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
};
