import { Request, Response, NextFunction } from "express";
import prisma from "@/src/lib/prisma.js";
import AppError from "@/src/lib/AppError.js";
import { statusCodes } from "@/src/constants/statusCodes.js";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers["authorization"];

    if (!token) throw new AppError("Unauthorized", statusCodes.UNAUTHORIZED);

    const session = await prisma.session.findFirst({
      where: {
        token,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!session) throw new AppError("Unauthorized", statusCodes.UNAUTHORIZED);
    if (!session.user.isActive) throw new AppError("Account is deactivated", statusCodes.UNAUTHORIZED);

    req.user = session.user;
    req.session = session;

    next();
  } catch (err) {
    next(err);
  }
}
