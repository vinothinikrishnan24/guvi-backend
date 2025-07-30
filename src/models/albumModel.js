import mongoose from "mongoose";

const albumSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  bgColour: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      text: String,
      user: String,
    },
  ],
});

const albumModel = mongoose.model("album", albumSchema);
export default albumModel;