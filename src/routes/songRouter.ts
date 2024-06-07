import {
  getAllSongs,
  getSongByTitle,
  addSong,
  deleteSong,
  updateSong,
} from "../controllers/songController";
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { validateSong } from "../middlewares/validationSong";

const routerSong = Router();

routerSong.use(verifyToken);

routerSong.get("/", getAllSongs);
routerSong.get("/:title", getSongByTitle);
routerSong.post("/addSong", validateSong, addSong);
routerSong.delete("/deleteSong/:_id", deleteSong);
routerSong.put("/updateSong/:_id", validateSong, updateSong);

export { routerSong };
