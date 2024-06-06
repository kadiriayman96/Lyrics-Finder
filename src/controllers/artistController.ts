import { StatusCodes } from "http-status-codes";
import Artist from "../models/artist";
import { Request, Response } from "express";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
} from "../errors/index";
import deleteImage from "../utils/cloudinaryImageDelete";
import { CustomRequest } from "../middlewares/verifyToken";

dotenv.config();

//cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const getAllArtists = async (req: Request, res: Response) => {
  try {
    const listArtists = await Artist.find().populate("songs");

    if (!listArtists || listArtists.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("At least one artist is required !!").message,
      });
    }
    return res.status(StatusCodes.OK).json(listArtists);
  } catch (error: any) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getArtistByName = async (req: Request, res: Response) => {
  try {
    let { firstName, lastName } = req.params;

    if (!firstName && !lastName) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("One of the fields is required !!").message,
      });
    }

    let artist;
    if (firstName && lastName) {
      artist = await Artist.find({
        $or: [
          { firstName: new RegExp(firstName, "i") },
          { lastName: new RegExp(lastName, "i") },
        ],
      }).populate("songs");
    } else if (firstName) {
      artist = await Artist.find({
        firstName: new RegExp(firstName, "i"),
      }).populate("songs");
    } else if (lastName) {
      artist = await Artist.find({
        lastName: new RegExp(lastName, "i"),
      }).populate("songs");
    }

    if (!artist || artist.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("Artist not found !!").message,
      });
    }
    return res.status(StatusCodes.OK).json(artist);
  } catch (error: any) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const addArtist = async (req: CustomRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.isAdmin) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: new BadRequestError("Unauthorized access! Only admins can access")
        .message,
    });
  }
  try {
    let { firstName, lastName, genre, bornDate, birthCity, diedDate } =
      req.body;
    const image = req.file;
    if (!image) {
      return res.status(StatusCodes.CONFLICT).json({
        error: new ValidationError("Image File is required !!").message,
      });
    }

    if (!firstName || !lastName || !genre || !bornDate || !birthCity) {
      return res.status(StatusCodes.CONFLICT).json({
        error: new ValidationError("All Fields are required !!").message,
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.v2.uploader.upload(image.path);
    const pictureUrl = result.secure_url;

    const newArtist = await Artist.create({
      firstName,
      lastName,
      pictureUrl,
      genre,
      bornDate, // YYYY-MM-DD
      birthCity,
      diedDate: diedDate ? diedDate : null,
    });

    return res.status(StatusCodes.CREATED).json(newArtist);
  } catch (error: any) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const deleteArtist = async (req: CustomRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.isAdmin) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: new BadRequestError("Unauthorized access! Only admins can access")
        .message,
    });
  }
  try {
    const { _id } = req.params;
    const artist = await Artist.findByIdAndDelete(_id);
    if (!artist) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("Artist not found !!").message,
      });
    }
    deleteImage(artist);
    return res.status(StatusCodes.OK).json(artist);
  } catch (error: any) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateArtist = async (req: CustomRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.isAdmin) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: new BadRequestError("Unauthorized access! Only admins can access")
        .message,
    });
  }
  try {
    const { _id } = req.params;
    const { firstName, lastName, genre, bornDate, birthCity, diedDate } =
      req.body;
    const image = req.file;
    if (!_id) {
      return res.status(StatusCodes.CONFLICT).json({
        error: new ValidationError("Artist Id is required !!").message,
      });
    }
    const existingArtist = await Artist.findById(_id);
    if (!existingArtist) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("Artist not found !!").message,
      });
    }
    if (!firstName && !lastName && !genre && !bornDate && !birthCity) {
      return res.status(StatusCodes.CONFLICT).json({
        error: new ValidationError("Fields are required !!").message,
      });
    }
    if (!image) {
      return res.status(StatusCodes.CONFLICT).json({
        error: new ValidationError("Image File is required !!").message,
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.v2.uploader.upload(image.path);
    const pictureUrl = result.secure_url;

    //delete previous image
    deleteImage(existingArtist);

    const updatedArtist = await Artist.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        pictureUrl,
        genre,
        bornDate, // YYYY-MM-DD
        birthCity,
        diedDate: diedDate ? diedDate : null,
      },

      { new: true }
    );
    return res.status(StatusCodes.OK).json(updatedArtist);
  } catch (error: any) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export {
  getAllArtists,
  getArtistByName,
  addArtist,
  deleteArtist,
  updateArtist,
};
