import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import { routerArtist } from "../src/routes/artistRouter";
import { routerSong } from "../src/routes/songRouter";
import { routerAuth } from "../src/routes/authRouter";
import { routerUsers } from "../src/routes/usersRouter";
import { routerMail } from "../src/routes/newsletterRouter";
import { routerPassword } from "../src/routes/passwordRouter";
import sendNewsletterCronJob from "../src/utils/cronJob";
import cron from "node-cron";

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
app.use("/", routerAuth);
app.use("/artists", routerArtist);
app.use("/songs", routerSong);
app.use("/users", routerUsers);
app.use("/newsletter", routerMail);
app.use("/resetPassword", routerPassword);

//error router 404
app.use((req, res, next) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ error: "The route you are looking for does not exist !!" });
});

// Cron Job
cron.schedule("0 0 * * 0", sendNewsletterCronJob); // Envoi de la newsletter chaque semaine le dimanche à minuit

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// SALINA <3
