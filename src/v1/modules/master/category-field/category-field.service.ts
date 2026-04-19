import prisma from "@/src/lib/prisma";
import AppError from "@/src/lib/AppError";
import { statusCodes } from "@/src/constants/statusCodes";
import { FieldType } from "@/generated/prisma/client";
import paginate from "@/src/lib/paginate";

async function getAllCategoryFields(filters: {
  categoryId?: number;
  fieldType?: FieldType;
  page?: number;
  limit?: number;
  orderBy?: "asc" | "desc";
  orderByField?: "createdAt" | "name";
}) {
  const { categoryId, fieldType, page = 1, limit = 10, orderBy = "desc", orderByField = "createdAt" } = filters;

  const where = {
    isActive: true,
    ...(categoryId && { categoryId }),
    ...(fieldType && { fieldType }),
  };

  const [fields, total] = await prisma.$transaction([
    prisma.categoryField.findMany({
      where,
      orderBy: { [orderByField]: orderBy },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.categoryField.count({ where }),
  ]);

  return {
    fields,
    pagination: paginate(total, page, limit),
  };
}

async function getSingleCategoryFieldById(id: number) {
  const field = await prisma.categoryField.findUnique({
    where: { id, isActive: true },
  });

  if (!field) throw new AppError("Category field not found", statusCodes.NOT_FOUND);

  return field;
}

async function createCategoryField(data: {
  categoryId: number;
  name: string;
  fieldType: FieldType;
  options?: string[];
  isRequired: boolean;
}) {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId, isActive: true },
  });

  if (!category) throw new AppError("Category not found", statusCodes.NOT_FOUND);

  return await prisma.categoryField.create({ data });
}

async function updateCategoryField(
  id: number,
  data: {
    name?: string;
    fieldType?: FieldType;
    options?: string[];
    isRequired?: boolean;
  },
) {
  await getSingleCategoryFieldById(id);

  return await prisma.categoryField.update({
    where: { id },
    data,
  });
}

async function deleteCategoryField(id: number) {
  await getSingleCategoryFieldById(id);

  await prisma.categoryField.update({
    where: { id },
    data: { isActive: false },
  });
}

export const categoryFieldService = {
  getAllCategoryFields,
  getSingleCategoryFieldById,
  createCategoryField,
  updateCategoryField,
  deleteCategoryField,
};
