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
    const listArtists = await Artist.find();
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
const getOneArtist = async (req: Request, res: Response) => {
  try {
    let { firstName, lastName } = req.params;

    if (!firstName && !lastName) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("One of the fields is required !!").message,
      });
    }

    let artist;
    if (firstName && lastName) {
      artist = await Artist.find({ firstName, lastName });
    } else if (firstName) {
      artist = await Artist.find({ firstName });
    } else if (lastName) {
      artist = await Artist.find({ lastName });
    }

    if (!artist) {
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

const addArtist = async (req: Request, res: Response) => {
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

    const newArtist = new Artist({
      firstName,
      lastName,
      pictureUrl,
      genre,
      bornDate, // YYYY-MM-DD
      birthCity,
      diedDate: diedDate ? diedDate : null,
    });
    const artist = await newArtist.save();
    return res.status(StatusCodes.CREATED).json(artist);
  } catch (error: any) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export { getAllArtists, getOneArtist, addArtist };
