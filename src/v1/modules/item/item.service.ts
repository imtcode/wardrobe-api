import prisma from "@/src/lib/prisma";
import AppError from "@/src/lib/AppError";
import { statusCodes } from "@/src/constants/statusCodes";
import { Condition } from "@/generated/prisma/client";
import paginate from "@/src/lib/paginate";

async function getAllItems(filters: {
  search?: string;
  categoryId?: number;
  locationId?: number;
  condition?: Condition;
  color?: string;
  page?: number;
  limit?: number;
  orderBy?: "asc" | "desc";
  orderByField?: "createdAt" | "name" | "brand" | "condition";
}) {
  const { search, categoryId, locationId, condition, color, page = 1, limit = 10, orderBy = "desc", orderByField = "createdAt" } = filters;

  const where = {
    isActive: true,
    ...(categoryId && { categoryId }),
    ...(locationId && { locationId }),
    ...(condition && { condition }),
    ...(color && { color: { contains: color } }),
    ...(search && {
      OR: [{ name: { contains: search } }, { brand: { contains: search } }],
    }),
  };

  const [items, total] = await prisma.$transaction([
    prisma.item.findMany({
      where,
      orderBy: { [orderByField]: orderBy },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: true,
        location: true,
      },
    }),
    prisma.item.count({ where }),
  ]);

  return {
    items,
    pagination: paginate(total, page, limit),
  };
}

async function getSingleItemById(id: number) {
  const item = await prisma.item.findUnique({
    where: { id, isActive: true },
    include: {
      category: true,
      location: true,
      fieldValues: {
        include: {
          field: true,
        },
      },
    },
  });

  if (!item) throw new AppError("Item not found", statusCodes.NOT_FOUND);

  return item;
}

async function createItem(data: { name: string; brand?: string; color?: string; condition?: Condition; categoryId?: number; locationId?: number; images?: string[]; fieldValues?: { fieldId: number; value: string }[] }) {
  const { fieldValues, ...itemData } = data;

  const item = await prisma.item.create({
    data: {
      ...itemData,
      images: itemData.images ?? [],
      ...(fieldValues && {
        fieldValues: {
          create: fieldValues,
        },
      }),
    },
    include: {
      category: true,
      location: true,
      fieldValues: {
        include: { field: true },
      },
    },
  });

  return item;
}

async function updateItem(
  id: number,
  data: {
    name?: string;
    brand?: string;
    color?: string;
    condition?: Condition;
    categoryId?: number;
    locationId?: number;
    images?: string[];
    fieldValues?: { fieldId: number; value: string }[];
  },
) {
  await getSingleItemById(id);

  const { fieldValues, ...itemData } = data;

  if (fieldValues) {
    await prisma.itemFieldValue.deleteMany({
      where: { itemId: id },
    });
  }

  return await prisma.item.update({
    where: { id },
    data: {
      ...itemData,
      ...(fieldValues && {
        fieldValues: {
          create: fieldValues,
        },
      }),
    },
    include: {
      category: true,
      location: true,
      fieldValues: {
        include: { field: true },
      },
    },
  });
}

async function deleteItem(id: number) {
  await getSingleItemById(id);

  await prisma.item.update({
    where: { id },
    data: { isActive: false },
  });
}

export const itemService = {
  getAllItems,
  getSingleItemById,
  createItem,
  updateItem,
  deleteItem,
};
