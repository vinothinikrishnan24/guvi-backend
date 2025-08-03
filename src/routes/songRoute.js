import { addSong, listSong ,removeSong, searchSongs } from "../controllers/songController.js";
import express from 'express'
import upload from "../middleware/multer.js";
import multer from 'multer';



const songRouter = express.Router();

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


songRouter.post(
  '/add',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]),
  handleMulterError,
  addSong
);
songRouter.get('/list', listSong);
songRouter.post('/remove',removeSong);
songRouter.get("/search", searchSongs);


export default songRouter;