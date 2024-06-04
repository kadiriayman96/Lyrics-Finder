import { StatusCodes } from "http-status-codes";

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message?: string) {
    super(message || "You are not authorized to access this route !");
    this.name = "UnauthorizedError";
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthorizedError;
