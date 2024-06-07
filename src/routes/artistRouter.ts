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
import { validateArtist } from "../middlewares/validationArtiste";

const routerArtist = Router();

routerArtist.use(verifyToken);
routerArtist.get("/", getAllArtists);
routerArtist.get("/:firstName/:lastName?", getArtistByName);
routerArtist.post("/addArtist", upload.single("image"), validateArtist, addArtist);
routerArtist.delete("/deleteArtist/:_id", deleteArtist);
routerArtist.put("/updateArtist/:_id", upload.single("image"), validateArtist, updateArtist);

export { routerArtist };
