import { Request, Response, NextFunction } from "express";
import { categoryService } from "./category.service";
import sendResponse from "@/src/lib/sendResponse";
import { statusCodes } from "@/src/constants/statusCodes";

async function getAllCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const { search } = req.query;
    const categories = await categoryService.getAllCategories({ search: search as string });
    return sendResponse({ res, status: true, message: "Categories fetched successfully", data: categories });
  } catch (err) {
    next(err);
  }
}

async function getSingleCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const category = await categoryService.getSingleCategoryById(Number(id));
    return sendResponse({ res, status: true, message: "Category fetched successfully", data: category });
  } catch (err) {
    next(err);
  }
}

async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await categoryService.createCategory(req.body);
    return sendResponse({ res, status: true, message: "Category created successfully", data: category, statusCode: statusCodes.CREATED });
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const category = await categoryService.updateCategory(Number(id), req.body);
    return sendResponse({ res, status: true, message: "Category updated successfully", data: category });
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(Number(id));
    return sendResponse({ res, status: true, message: "Category deleted successfully" });
  } catch (err) {
    next(err);
  }
}

export const categoryController = {
  getAllCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
