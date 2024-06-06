import { Schema, model, Document, Types } from "mongoose";

interface Artist extends Document {
  firstName: string;
  lastName: string;
  pictureUrl: string;
  genre: string;
  bornDate: Date;
  birthCity: string;
  diedDate?: Date;
  songs?: Types.ObjectId[];
}

const artistSchema = new Schema<Artist>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  pictureUrl: { type: String, required: true },
  genre: { type: String, required: true },
  bornDate: { type: Date, required: true },
  birthCity: { type: String, required: true },
  diedDate: { type: Date },
});

// Define virtual field for songs
artistSchema.virtual("songs", {
  ref: "Song",
  localField: "_id",
  foreignField: "singer",
});

// Ensure virtual fields are serialized
artistSchema.set("toObject", { virtuals: true });
artistSchema.set("toJSON", { virtuals: true });

export default model<Artist>("Artist", artistSchema);
