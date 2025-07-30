import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  album: { type: String, default: null },
  artist: { type: String, required: true }, // Add artist
  movie: { type: String, default: null },  // Add movie
  image: { type: String, required: true },
  file: { type: String, required: true },
  duration: { type: String, required: true },
});

export default mongoose.model('Song', songSchema);