import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/index";
import { StatusCodes } from "http-status-codes";
import User, { IUser } from "../models/user";

interface CustomRequest extends Request {
  user?: IUser;
  token?: string;
}
interface JwtPayload {
  user: IUser;
}

function verifyToken(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new UnauthorizedError("No token provided");
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const payload = jwt.verify(token, "user_key") as JwtPayload;
    req.user = payload.user;
    next();
  } catch (error: any) {
    console.log(error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}

export { verifyToken, CustomRequest };
