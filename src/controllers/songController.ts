import { StatusCodes } from "http-status-codes";
import Song from "../models/song";
import Artist from "../models/artist"; // Import Artist model
import { Request, Response } from "express";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
} from "../errors/index";
import { CustomRequest } from "../middlewares/verifyToken";

const getAllSongs = async (req: Request, res: Response) => {
  try {
    const listSongs = await Song.find().populate(
      "singer",
      "firstName lastName"
    ); // Populate singer details
    if (!listSongs || listSongs.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("At least one song is required !!").message,
      });
    }
    return res.status(StatusCodes.OK).json(listSongs);
  } catch (error: any) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: new BadRequestError("Something went wrong !! Contact the Admin")
        .message,
    });
  }
};

const getSongByTitle = async (req: Request, res: Response) => {
  try {
    const { title } = req.params;
    const song = await Song.find({ title: new RegExp(title, "i") }).populate(
      "singer",
      "firstName lastName"
    );
    if (!song || song.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("Song not found !!").message,
      });
    }
    return res.status(StatusCodes.OK).json(song);
  } catch (error: any) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: new BadRequestError("Something went wrong !! Contact the Admin")
        .message,
    });
  }
};

const addSong = async (req: CustomRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.isAdmin) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: new BadRequestError("Unauthorized access! Only admins can access")
        .message,
    });
  }
  try {
    const { genre, title, recordedDate, lyrics, singer } = req.body;

    if (!genre || !title || !recordedDate || !lyrics || !singer) {
      return res.status(StatusCodes.CONFLICT).json({
        error: new ValidationError("All fields are required !!").message,
      });
    }

    // Ensure the singer (Artist) exists
    const artistExists = await Artist.findById(singer);
    if (!artistExists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("Singer (Artist) not found !!").message,
      });
    }

    const newSong = await Song.create({
      genre,
      title,
      recordedDate,
      lyrics,
      singer,
    });

    return res.status(StatusCodes.CREATED).json(newSong);
  } catch (error: any) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: new BadRequestError("Something went wrong !! Contact the Admin")
        .message,
    });
  }
};

const deleteSong = async (req: CustomRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.isAdmin) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: new BadRequestError("Unauthorized access! Only admins can access")
        .message,
    });
  }
  try {
    const { _id } = req.params;
    const song = await Song.findByIdAndDelete(_id);
    if (!song) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("Song not found !!").message,
      });
    }

    return res.status(StatusCodes.OK).json(song);
  } catch (error: any) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: new BadRequestError("Something went wrong !! Contact the Admin")
        .message,
    });
  }
};

const updateSong = async (req: CustomRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.isAdmin) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: new BadRequestError("Unauthorized access! Only admins can access")
        .message,
    });
  }
  try {
    const { _id } = req.params;
    const { genre, title, recordedDate, lyrics, singer } = req.body;
    if (!_id) {
      return res.status(StatusCodes.CONFLICT).json({
        error: new ValidationError("Song Id is required !!").message,
      });
    }
    const existingSong = await Song.findById(_id);
    if (!existingSong) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: new NotFoundError("Song not found !!").message,
      });
    }
    if (!genre && !title && !recordedDate && !lyrics && !singer) {
      return res.status(StatusCodes.CONFLICT).json({
        error: new ValidationError("Fields are required !!").message,
      });
    }

    // Ensure the singer (Artist) exists
    if (singer) {
      const artistExists = await Artist.findById(singer);
      if (!artistExists) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: new NotFoundError("Singer (Artist) not found !!").message,
        });
      }
    }

    const updatedSong = await Song.findByIdAndUpdate(
      _id,
      {
        genre,
        title,
        recordedDate,
        lyrics,
        singer,
      },
      { new: true }
    );

    return res.status(StatusCodes.OK).json(updatedSong);
  } catch (error: any) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: new BadRequestError("Something went wrong !! Contact the Admin")
        .message,
    });
  }
};

export { getAllSongs, getSongByTitle, addSong, deleteSong, updateSong };
