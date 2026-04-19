import prisma from "@/src/lib/prisma";
import { buildPath, buildTree } from "./category.helper";
import AppError from "@/src/lib/AppError";
import { statusCodes } from "@/src/constants/statusCodes";

async function getAllCategories(filters: { search?: string }) {
  const { search } = filters;

  const allCategories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Return Linear List with path leading upto it - if Search
  if (search) {
    const filtered = await prisma.category.findMany({
      where: {
        isActive: true,
        name: { contains: search },
      },
    });

    return filtered.map((loc) => ({
      ...loc,
      path: buildPath(allCategories, loc.id),
    }));
  }

  // Return Tree Structure - Generally
  return buildTree(allCategories, null);
}

async function getSingleCategoryById(id: number) {
  const category = await prisma.category.findUnique({
    where: {
      id,
      isActive: true,
    },
  });

  if (!category) throw new AppError("Category not found", statusCodes.NOT_FOUND);

  const allCategories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
  });

  const children = buildTree(allCategories, category.id);

  return { category, children };
}

async function createCategory(data: { name: string; parentId?: number | null }) {
  if (data.parentId) {
    const parent = await prisma.category.findUnique({
      where: { id: data.parentId, isActive: true },
    });

    if (!parent) throw new AppError("Parent category not found", statusCodes.NOT_FOUND);
  }

  return await prisma.category.create({
    data,
  });
}

async function updateCategory(id: number, data: { name: string; parentId?: number | null }) {
  const category = await prisma.category.findUnique({
    where: {
      id,
      isActive: true,
    },
  });

  if (!category) throw new AppError("No such category", statusCodes.NOT_FOUND);

  if (data.parentId) {
    const parent = await prisma.category.findUnique({
      where: { id: data.parentId, isActive: true },
    });

    if (!parent) throw new AppError("Parent category not found", statusCodes.NOT_FOUND);
  }

  return await prisma.category.update({
    where: { id },
    data,
  });
}

async function deleteCategory(id: number) {
  const category = await prisma.category.findUnique({
    where: {
      id,
      isActive: true,
    },
  });

  if (!category) throw new AppError("No such category", statusCodes.NOT_FOUND);

  const hasChildren = await prisma.category.findFirst({
    where: { parentId: id, isActive: true },
  });

  if (hasChildren) throw new AppError("Cannot delete a category with sub-categories", statusCodes.BAD_REQUEST);

  // Check if in use with any items, if yes, do not delete

  await prisma.category.update({
    where: { id },
    data: { isActive: false },
  });
}

export const categoryService = {
  getAllCategories,
  getSingleCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
