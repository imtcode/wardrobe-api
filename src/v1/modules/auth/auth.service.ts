import { statusCodes } from "@/src/constants/statusCodes";
import AppError from "@/src/lib/AppError";
import prisma from "@/src/lib/prisma";
import bcrypt from "bcrypt";
import moment from "moment";

async function login(email: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      email,
      isActive: true,
    },
  });

  if (!user) throw new AppError("Invalid email or password", statusCodes.UNAUTHORIZED);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new AppError("Invalid email or password", statusCodes.UNAUTHORIZED);

  return user;
}

async function generateOtp(userId: number) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = moment().add(10, "minutes").toDate();

  await prisma.otpCode.create({
    data: {
      userId,
      code,
      expiresAt,
    },
  });

  return code;
}

async function verifyOtp(userId: number, code: string) {
  const otp = await prisma.otpCode.findFirst({
    where: {
      userId,
      code,
      isUsed: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!otp) throw new AppError("Invalid or expired OTP", statusCodes.UNAUTHORIZED);

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { isUsed: true },
  });
}

async function createSession(userId: number, ipAddress?: string, userAgent?: string) {
  const token = crypto.randomUUID();
  const expiresAt = moment().add(7, "days").toDate();

  const session = await prisma.session.create({
    data: {
      userId,
      token,
      ipAddress,
      userAgent,
      expiresAt,
    },
    include: { user: true },
  });

  return session;
}

async function logout(token: string) {
  const session = await prisma.session.findFirst({
    where: { token, isActive: true },
    include: { user: true },
  });

  if (!session) throw new AppError("Session not found", statusCodes.UNAUTHORIZED);

  await prisma.session.update({
    where: { id: session.id },
    data: { isActive: false },
  });

  return session;
}

export const authService = {
  login,
  generateOtp,
  verifyOtp,
  createSession,
  logout,
};
