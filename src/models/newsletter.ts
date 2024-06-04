import { Schema, model, Document } from 'mongoose';

interface Newsletter extends Document {
  email: string;
  subscribedAt: Date;
}

const newsletterSchema = new Schema<Newsletter>({
  email: { type: String, required: true },
  subscribedAt: { type: Date, default: Date.now() },
});

export default model<Newsletter>('Newsletter', newsletterSchema);
