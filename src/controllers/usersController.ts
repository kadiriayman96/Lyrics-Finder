import { StatusCodes } from "http-status-codes";
import User, { IUser } from "../models/user";
import { Request, Response } from "express";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
} from "../errors/index";
import { CustomRequest } from "../middlewares/verifyToken";

const getAllUsers = async (req: CustomRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.isAdmin) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: new BadRequestError("Unauthorized access! Only admins can access")
        .message,
    });
  }
  try {
    const listUsers = await User.find();
    if (!listUsers || listUsers.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("No users found, Create at least one user!")
          .message,
      });
    }
    return res.status(StatusCodes.OK).json(listUsers);
  } catch (error: any) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: new BadRequestError("Something went wrong !! Contact the Admin")
        .message,
    });
  }
};
const updateUserRole = async (req: CustomRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.isAdmin) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: new BadRequestError("Unauthorized access! Only admins can access")
        .message,
    });
  }
  try {
    const { _id } = req.params;
    const { isAdmin } = req.body;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("User not found !!").message,
      });
    }

    if (typeof isAdmin !== "boolean") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: new ValidationError("isAdmin must be a boolean").message,
      });
    }

    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        $set: {
          isAdmin: isAdmin,
        },
      },
      { new: true }
    );
    return res.status(StatusCodes.OK).json(updateUser);
  } catch (error: any) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: new BadRequestError("Something went wrong !! Contact the Admin")
        .message,
    });
  }
};
const deleteUser = async (req: CustomRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.isAdmin) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: new BadRequestError("Unauthorized access! Only admins can access")
        .message,
    });
  }
  try {
    const { _id } = req.params;
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("User not found !!").message,
      });
    }
    return res.status(StatusCodes.OK).json(user);
  } catch (error: any) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: new BadRequestError("Something went wrong !! Contact the Admin")
        .message,
    });
  }
};

export { getAllUsers, deleteUser, updateUserRole };
