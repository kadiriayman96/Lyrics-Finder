import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ;
const db_uri = process.env.MONGO_URI || '';

app.use(express.json());
mongoose.connect(db_uri, {})
.then(() => console.log('MongoDB connected ..'))
.catch(err => console.error('MongoDB connection error :', err));

//routers


// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
