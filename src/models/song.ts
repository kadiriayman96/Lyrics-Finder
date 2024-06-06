import { Schema, model, Document, Types } from "mongoose";

interface Song extends Document {
  genre: string;
  title: string;
  recordedDate: Date;
  lyrics: string;
  singer: Types.ObjectId; // This ensures the type is correctly set as ObjectId
}

const songSchema = new Schema<Song>({
  genre: { type: String, required: true },
  title: { type: String, required: true },
  recordedDate: { type: Date, required: true },
  lyrics: { type: String, required: true },
  singer: { type: Schema.Types.ObjectId, ref: "Artist", required: true }, // Reference to Artist
});

export default model<Song>("Song", songSchema);
