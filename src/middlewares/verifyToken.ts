import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/index";
import { StatusCodes } from "http-status-codes";
import User, { IUser } from "../models/user";

declare global {
  interface UserData {
    firstName: String;
    lastName: String;
    email: String;
    password: String;
    isAdmin: Boolean;
  }
  namespace Express {
    interface Request {
      user?: UserData;
    }
  }
}
interface JwtPayload {
  user: IUser;
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
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

export { verifyToken };
