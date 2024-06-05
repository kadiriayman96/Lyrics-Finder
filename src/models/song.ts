import { Schema, model, Document } from "mongoose";

interface Song extends Document {
  genre: string;
  title: string;
  recordedDate: Date;
  lyrics: string;
  singer: string;
}

const songSchema = new Schema<Song>({
  genre: { type: String, required: true },
  title: { type: String, required: true },
  recordedDate: { type: Date, required: true },
  lyrics: { type: String, required: true },
  singer: { type: String, required: true },
});

export default model<Song>("Song", songSchema);
