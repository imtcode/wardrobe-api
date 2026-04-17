import { statusCodes, statusCodeType } from "@/src/constants/statusCodes";

class AppError extends Error {
  statusCode: statusCodeType;
  data?: any;

  constructor(message: string, statusCode: statusCodeType = statusCodes.BAD_REQUEST, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

export default AppError;
