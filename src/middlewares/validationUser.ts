import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const validateUser = [
  body("isAdmin").isBoolean().withMessage("isAdmin must be a boolean"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map((err) => err.msg) });
    }
    next();
  },
];
export { validateUser };
