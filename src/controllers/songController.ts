import { StatusCodes } from "http-status-codes";
import Song from "../models/song";
import { Request, Response } from "express";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
} from "../errors/index";

const getAllSongs = async (req: Request, res: Response) => {
  try {
    const listSongs = await Song.find();
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
    const song = await Song.find({ title: new RegExp(title, "i") });
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

const addSong = async (req: Request, res: Response) => {
  try {
    const { genre, title, recordedDate, lyrics, singer } = req.body;

    if (!genre || !title || !recordedDate || !lyrics || !singer) {
      return res.status(StatusCodes.CONFLICT).json({
        error: new ValidationError("All fields are required !!").message,
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

const deleteSong = async (req: Request, res: Response) => {
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

const updateSong = async (req: Request, res: Response) => {
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
        error: new NotFoundError("Artist not found !!").message,
      });
    }
    if (!genre && !title && !recordedDate && !lyrics && !singer) {
      return res.status(StatusCodes.CONFLICT).json({
        error: new ValidationError("Fields are required !!").message,
      });
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
