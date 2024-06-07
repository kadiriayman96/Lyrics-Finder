import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const validateArtist = [
  body("firstName")
    .isLength({ min: 1 })
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("First name must contain only letters"),
  body("lastName")
    .isLength({ min: 1 })
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name must contain only letters"),
  body("genre")
    .isLength({ min: 3 })
    .withMessage("Genre must be at least 3 characters")
    .isAlpha()
    .withMessage("Genre must contain only letters"),
  body("bornDate")
    .isISO8601()
    .withMessage("Born date must be a valid date in YYYY-MM-DD format"),
  body("birthCity")
    .isLength({ min: 1 })
    .withMessage("Birth city is required")
    .isAlpha()
    .withMessage("Birth city must contain only letters"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map((err) => err.msg) });
    }
    next();
  },
];

export { validateArtist };
