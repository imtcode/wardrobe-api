import prisma from "@/src/lib/prisma";
import AppError from "@/src/lib/AppError";
import { statusCodes } from "@/src/constants/statusCodes";
import { Role } from "@/generated/prisma/client";
import paginate from "@/src/lib/paginate";
import crypto from "crypto";
import bcrypt from "bcrypt";

async function getAllUsers(filters: {
  search?: string;
  role?: Role;
  page?: number;
  limit?: number;
  orderBy?: "asc" | "desc";
  orderByField?: "createdAt" | "name";
}) {
  const { search, role, page = 1, limit = 10, orderBy = "desc", orderByField = "createdAt" } = filters;

  const where = {
    isActive: true,
    ...(role && { role }),
    ...(search && {
      OR: [{ name: { contains: search } }, { email: { contains: search } }, { mobile: { contains: search } }],
    }),
  };

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      orderBy: { [orderByField]: orderBy },
      skip: (page - 1) * limit,
      take: limit,
      omit: { password: true },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: paginate(total, page, limit),
  };
}

async function getSingleUserById(id: number) {
  const user = await prisma.user.findFirst({
    where: { id, isActive: true },
    omit: { password: true },
  });

  if (!user) throw new AppError("User not found", statusCodes.NOT_FOUND);

  return user;
}

async function createUser(data: { name: string; email: string; mobile: string; role: Role }) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { mobile: data.mobile }],
      isActive: true,
    },
  });
  if (existingUser) throw new AppError("User with this email or mobile already exists", statusCodes.CONFLICT);

  const rawPassword = crypto.randomBytes(6).toString("base64").slice(0, 8);
  console.log("TODO: SEND RAW PASSWORD ", { rawPassword });
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    omit: { password: true },
  });

  // TODO: send email with rawPassword here

  return user;
}

async function updateUser(id: number, data: { name?: string; email?: string; mobile?: string; role?: Role; password?: string }) {
  const user = await getSingleUserById(id);

  if (data.email && data.email !== user.email) {
    const existingUser = await prisma.user.findFirst({
      where: { email: data.email, isActive: true },
    });
    if (existingUser) throw new AppError("User with this email already exists", statusCodes.CONFLICT);
  }

  if (data.mobile && data.mobile !== user.mobile) {
    const existingUser = await prisma.user.findFirst({
      where: { mobile: data.mobile, isActive: true },
    });
    if (existingUser) throw new AppError("User with this mobile already exists", statusCodes.CONFLICT);
  }

  if (data.password) {
    const rawPassword = data.password;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    data.password = hashedPassword;

    await prisma.session.updateMany({
      where: { userId: id },
      data: { isActive: false },
    });

    // Send mail to user saying password has been changed
    console.log("TODO: SEND MAIL TO USER SAYING PASSWORD HAS BEEN CHANGED ", { newPassword: rawPassword });
  }

  return await prisma.user.update({
    where: { id },
    omit: { password: true },
    data,
  });
}

async function deleteUser(id: number) {
  await getSingleUserById(id);

  await prisma.session.updateMany({
    where: { userId: id },
    data: { isActive: false },
  });

  await prisma.user.update({
    where: { id },
    data: { isActive: false },
  });
}

export const userService = {
  getAllUsers,
  getSingleUserById,
  createUser,
  updateUser,
  deleteUser,
};
