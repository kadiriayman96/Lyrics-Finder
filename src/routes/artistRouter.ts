import {
  getAllArtists,
  getArtistByName,
  addArtist,
  deleteArtist,
  updateArtist,
} from "../controllers/artistController";
import { Router } from "express";
import upload from "../middlewares/uploadImage";
import { verifyToken } from "../middlewares/verifyToken";

const routerArtist = Router();

routerArtist.use(verifyToken);
routerArtist.get("/", getAllArtists);
routerArtist.get("/:firstName/:lastName?", getArtistByName);
routerArtist.post("/addArtist", upload.single("image"), addArtist);
routerArtist.delete("/deleteArtist/:_id", deleteArtist);
routerArtist.put("/updateArtist/:_id", upload.single("image"), updateArtist);

export { routerArtist };
