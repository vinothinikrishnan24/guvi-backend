import mongoose from "mongoose";

const playlistSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
});

const playlistModel = mongoose.model("playlist", playlistSchema);
export default playlistModel;