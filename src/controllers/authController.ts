import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "../errors/index";
import hashPassword from "../utils/hashPassword";
import generateToken from "../utils/jwt";
import comparePasswords from "../utils/comparePasswords";
import { StatusCodes } from "http-status-codes";
import User from "../models/user";

// User Register
const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if all the data are filled
    if (!firstName || !lastName || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: new BadRequestError("Please fill all the data").message,
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: new BadRequestError("User already exists").message,
      });
    }

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Save the user in the database
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isAdmin: false,
    });
    await newUser.save();

    // Generate Token
    const token = generateToken({ user: newUser }, "user_key");

    // Send response and token
    return res.status(StatusCodes.CREATED).json({ token });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// User Login
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: new BadRequestError("Please fill all the data").message,
      });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("User not found").message,
      });
    }

    // Compare passwords
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: new UnauthorizedError("Incorrect email or password").message,
      });
    }

    // Generate Token
    const token = generateToken({ user }, "user_key");
    return res.status(StatusCodes.OK).json({ token });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export { register, loginUser };
