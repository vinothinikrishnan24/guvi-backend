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
import multer from 'multer';

const albumRouter = express.Router();

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds the 10MB limit' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

albumRouter.post("/add", upload.single("image"), handleMulterError, addAlbum);
albumRouter.get("/list", listAlbum);
albumRouter.post("/remove", removeAlbum);
albumRouter.post("/like", likeAlbum);
albumRouter.post("/comment", commentAlbum);
albumRouter.get("/interactions/:id", getAlbumInteractions);
albumRouter.get("/search", searchAlbums);

export default albumRouter;