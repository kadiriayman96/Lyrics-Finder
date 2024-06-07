import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const validateSong = [
  body("genre")
    .isLength({ min: 3 })
    .withMessage("Genre must be at least 3 characters")
    .isAlpha()
    .withMessage("Genre must contain only letters"),
  body("title")
    .isLength({ min: 2 })
    .withMessage("Title must be at least 2 characters")
    .isString()
    .withMessage("Title must be valid"),
  body("recordedDate")
    .isISO8601()
    .withMessage("Recorded date must be a valid date in YYYY-MM-DD format"),
  body("lyrics")
    .isLength({ min: 100 })
    .withMessage("Lyrics must be at least 100 characters"),
  body("singer")
    .isMongoId()
    .withMessage(
      "Singer must be a valid Mongo ID and already exists in the database"
    ),
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

export { validateSong };
