import {
  getAllSongs,
  getSongByTitle,
  addSong,
  deleteSong,
  updateSong,
} from "../controllers/songController";
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";

const routerSong = Router();

routerSong.use(verifyToken);
routerSong.get("/", getAllSongs);
routerSong.get("/:title", getSongByTitle);
routerSong.post("/addSong", addSong);
routerSong.delete("/deleteSong/:_id", deleteSong);
routerSong.put("/updateSong/:_id", updateSong);

export { routerSong };
