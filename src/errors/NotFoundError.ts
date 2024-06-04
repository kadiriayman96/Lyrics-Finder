import { StatusCodes } from "http-status-codes";

class NotFoundError extends Error {
  statusCode: number;

  constructor(message?: string) {
    super(message || "The resource you requested could not be found !");
    this.name = "NotFoundError";
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export default NotFoundError;
