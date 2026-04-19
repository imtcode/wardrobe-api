import prisma from "@/src/lib/prisma";
import { buildPath, buildTree } from "./location.helper";
import AppError from "@/src/lib/AppError";
import { statusCodes } from "@/src/constants/statusCodes";

async function getAllLocations(filters: { search?: string }) {
  const { search } = filters;

  const allLocations = await prisma.location.findMany({
    where: {
      isActive: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Return Linear List with path leading upto it - if Search
  if (search) {
    const filtered = await prisma.location.findMany({
      where: {
        isActive: true,
        name: { contains: search },
      },
    });

    return filtered.map((loc) => ({
      ...loc,
      path: buildPath(allLocations, loc.id),
    }));
  }

  // Return Tree Structure - Generally
  return buildTree(allLocations, null);
}

async function getSingleLocationById(id: number) {
  const location = await prisma.location.findUnique({
    where: {
      id,
      isActive: true,
    },
  });

  if (!location) throw new AppError("Location not found", statusCodes.NOT_FOUND);

  const allLocations = await prisma.location.findMany({
    where: {
      isActive: true,
    },
  });

  const children = buildTree(allLocations, location.id);
  const path = buildPath(allLocations, location.id);

  return { location, children, path };
}

async function createLocation(data: { name: string; parentId?: number | null }) {
  if (data.parentId) {
    const parent = await prisma.location.findUnique({
      where: { id: data.parentId, isActive: true },
    });

    if (!parent) throw new AppError("Parent location not found", statusCodes.NOT_FOUND);
  }

  return await prisma.location.create({
    data,
  });
}

async function updateLocation(id: number, data: { name: string; parentId?: number | null }) {
  const location = await prisma.location.findUnique({
    where: {
      id,
      isActive: true,
    },
  });

  if (!location) throw new AppError("No such location", statusCodes.NOT_FOUND);

  if (data.parentId) {
    const parent = await prisma.location.findUnique({
      where: { id: data.parentId, isActive: true },
    });

    if (!parent) throw new AppError("Parent location not found", statusCodes.NOT_FOUND);
  }

  return await prisma.location.update({
    where: { id },
    data,
  });
}

async function deleteLocation(id: number) {
  const location = await prisma.location.findUnique({
    where: {
      id,
      isActive: true,
    },
  });

  if (!location) throw new AppError("No such location", statusCodes.NOT_FOUND);

  const hasChildren = await prisma.location.findFirst({
    where: { parentId: id, isActive: true },
  });

  if (hasChildren) throw new AppError("Cannot delete a location with sub-locations", statusCodes.BAD_REQUEST);

  // Check if in use with any items, if yes, do not delete

  return await prisma.location.update({
    where: { id },
    data: { isActive: false },
  });
}

export const locationService = {
  getAllLocations,
  getSingleLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};
