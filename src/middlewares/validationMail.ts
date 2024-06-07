import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const validateEmail = [
    body("email")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .matches(/@gmail\.com$/)
    .withMessage("Email must end with @gmail.com"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
        .status(400)
        .json({ errors: errors.array().map((err) => err.msg) });    }
    next();
  },
];

export { validateEmail };