import express from "express";
import {
  addPlaylist,
  listPlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from "../controllers/playListController.js";

const playlistRouter = express.Router();

playlistRouter.post("/add", addPlaylist);
playlistRouter.get("/list", listPlaylists);
playlistRouter.post("/add-song", addSongToPlaylist);
playlistRouter.post("/remove-song", removeSongFromPlaylist);

export default playlistRouter;