import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "../errors/index";
import hashPassword from "../utils/hashPassword";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import User from "../models/user";

const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { newPassword } = req.body;
        const authHeader = req.headers.authorization;

        // Validate authorization header and token presence
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: new UnauthorizedError("Authorization token missing").message,
            });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token:', token);

        const decodedToken: any = jwt.verify(token, 'user_key'); // Remplacez 'user_key' par la clé secrète utilisée pour signer le token JWT

        const userId = decodedToken.user._id;

        // Validate newPassword
        if (!newPassword) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: new BadRequestError("Please provide a new password").message,
            });
        }

        // Fetch the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                error: new NotFoundError("User not found").message,
            });
        }

        // Hash the new password
        const hashedNewPassword = await hashPassword(newPassword);

        // Update the user's password
        user.password = hashedNewPassword;
        await user.save();

        return res.status(StatusCodes.OK).json({ message: "Password updated successfully" });
    } catch (error: any) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};

export { updatePassword };
