import { Request, Response, NextFunction } from "express";
import { categoryFieldService } from "./category-field.service";
import sendResponse from "@/src/lib/sendResponse";
import { statusCodes } from "@/src/constants/statusCodes";
import { EntityType, FieldType, LogType } from "@/generated/prisma/client";
import createLog from "@/src/lib/createLog";

async function getAllCategoryFields(req: Request, res: Response, next: NextFunction) {
  try {
    const { categoryId, fieldType, page, limit } = req.query;

    const result = await categoryFieldService.getAllCategoryFields({
      categoryId: categoryId ? Number(categoryId) : undefined,
      fieldType: fieldType as FieldType,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    return sendResponse({ res, status: true, message: "Category fields fetched successfully", data: result });
  } catch (err) {
    next(err);
  }
}

async function getSingleCategoryField(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const field = await categoryFieldService.getSingleCategoryFieldById(Number(id));
    return sendResponse({ res, status: true, message: "Category field fetched successfully", data: field });
  } catch (err) {
    next(err);
  }
}

async function createCategoryField(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: userId } = req.user;
    const field = await categoryFieldService.createCategoryField(req.body);

    await createLog({
      type: LogType.SYSTEM,
      entityType: EntityType.CATEGORY,
      entityId: field.id,
      userId,
      message: `Created Category Field ${field.name} for category ${field.category.name}`,
    });

    return sendResponse({
      res,
      status: true,
      message: "Category field created successfully",
      data: field,
      statusCode: statusCodes.CREATED,
    });
  } catch (err) {
    next(err);
  }
}

async function updateCategoryField(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const field = await categoryFieldService.updateCategoryField(Number(id), req.body);
    await createLog({
      type: LogType.SYSTEM,
      entityType: EntityType.CATEGORY,
      entityId: field.id,
      userId,
      message: `Updated Category Field ${field.name} for category ${field.category.name}`,
    });
    return sendResponse({ res, status: true, message: "Category field updated successfully", data: field });
  } catch (err) {
    next(err);
  }
}

async function deleteCategoryField(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const field = await categoryFieldService.deleteCategoryField(Number(id));

    await createLog({
      type: LogType.SYSTEM,
      entityType: EntityType.CATEGORY,
      entityId: Number(id),
      userId,
      message: `Deleted Category Field ${field.name} for category ${field.category.name}`,
    });

    return sendResponse({ res, status: true, message: "Category field deleted successfully" });
  } catch (err) {
    next(err);
  }
}

export const categoryFieldController = {
  getAllCategoryFields,
  getSingleCategoryField,
  createCategoryField,
  updateCategoryField,
  deleteCategoryField,
};
