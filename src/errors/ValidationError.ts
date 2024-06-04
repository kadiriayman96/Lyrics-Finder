import { StatusCodes } from "http-status-codes";

class ValidationError extends Error {
  statusCode: number;

  constructor(message?: string) {
    super(message || "The data you provided is not valid !");
    this.name = "ValidationError";
    this.statusCode = StatusCodes.CONFLICT;
  }
}

export default ValidationError;
