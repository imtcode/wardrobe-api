import { Request, Response, NextFunction } from "express";
import { Role } from "../../generated/prisma/client.js";
import AppError from "@/src/lib/AppError.js";
import { statusCodes } from "@/src/constants/statusCodes.js";

export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", statusCodes.FORBIDDEN));
    }
    next();
  };
}
