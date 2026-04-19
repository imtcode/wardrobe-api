import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import sendResponse from "@/src/lib/sendResponse";
import { statusCodes } from "@/src/constants/statusCodes";
import createLog from "@/src/lib/createLog";
import { EntityType, LogType } from "@/generated/prisma/client";

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    const otp = await authService.generateOtp(user.id);

    console.log("TODO: SEND OTP ", { otp });

    // TODO: send otp here

    await createLog({
      type: LogType.SYSTEM,
      entityType: EntityType.USER,
      entityId: user.id,
      userId: user.id,
      message: `Login initiated for ${user.name}`,
    });

    return sendResponse({
      res,
      statusCode: statusCodes.OK,
      message: "OTP sent successfully",
      status: true,
    });
  } catch (err) {
    next(err);
  }
}

async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, code } = req.body;
    await authService.verifyOtp(userId, code);

    const session = await authService.createSession(userId, req.ip, req.headers["user-agent"]);

    await createLog({
      type: LogType.SYSTEM,
      entityType: EntityType.USER,
      entityId: session.userId,
      userId: session.userId,
      message: `User ${session.user.name} logged in`,
    });

    return sendResponse({
      res,
      status: true,
      message: "Logged in successfully",
      data: { token: session.token },
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers["authorization"];
    if (!token) throw new Error("No token provided");

    const session = await authService.logout(token);

    await createLog({
      type: LogType.SYSTEM,
      entityType: EntityType.USER,
      entityId: session.userId,
      userId: session.userId,
      message: `User ${session.user.name} logged out`,
    });

    return sendResponse({
      res,
      status: true,
      message: "Logged out successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}

export const authController = {
  login,
  verifyOtp,
  logout,
};
