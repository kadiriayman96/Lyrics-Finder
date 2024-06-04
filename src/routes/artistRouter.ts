import {
  getAllArtists,
  getOneArtist,
  addArtist,
} from "../controllers/artistController";
import { Router } from "express";
import upload from "../middlewares/uploadImage";

const routerArtist = Router();

routerArtist.get("/", getAllArtists);
routerArtist.get("/:firstName/:lastName?", getOneArtist);
routerArtist.post("/addArtist", upload.single("image"), addArtist);

export { routerArtist };
