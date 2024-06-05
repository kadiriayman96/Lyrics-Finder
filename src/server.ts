import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import { routerArtist } from "../src/routes/artistRouter";
import { routerSong } from "../src/routes/songRouter";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const db_uri = process.env.MONGO_URI || "";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose
  .connect(db_uri, {})
  .then(() => console.log("MongoDB connected .."))
  .catch((err) => console.error("MongoDB connection error :", err));

//routers
app.use("/artists", routerArtist);
app.use("/songs", routerSong);

//error router 404
app.use((req, res, next) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ error: "The route you are looking for does not exist !!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});