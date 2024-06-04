import { StatusCodes } from "http-status-codes";

class BadRequestError extends Error {
  statusCode: number;

  constructor(message?: string) {
    super(message || "This is a Bad Request ! Please check your request !");
    this.name = "BadRequestError";
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequestError;
