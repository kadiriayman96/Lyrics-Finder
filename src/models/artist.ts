import { Schema, model, Document } from 'mongoose';

interface Artist extends Document {
  firstName: string;
  lastName: string;
  pictureUrl: string;
  genre: string;
  bornDate: Date;
  birthCity: string;
  diedDate?: Date;
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

export default model<Artist>('Artist', artistSchema);
