import express from "express";
import {
  addAlbum,
  listAlbum,
  removeAlbum,
  likeAlbum,
  commentAlbum,
  getAlbumInteractions,
  searchAlbums,
} from "../controllers/albumControllers.js";
import upload from "../middleware/multer.js";

const albumRouter = express.Router();

albumRouter.post("/add", upload.single("image"), addAlbum);
albumRouter.get("/list", listAlbum);
albumRouter.post("/remove", removeAlbum);
albumRouter.post("/like", likeAlbum);
albumRouter.post("/comment", commentAlbum);
albumRouter.get("/interactions/:id", getAlbumInteractions);
albumRouter.get("/search", searchAlbums);

export default albumRouter;