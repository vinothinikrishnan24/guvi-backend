import { v2 as cloudinary } from 'cloudinary'
import songModel from '../models/songModel.js';
import fs from 'fs';



const addSong = async (req, res) => {
  try {
    // Extract text fields from req.body
    const { name, desc, album, artist } = req.body;

    // Extract files from req.files
    const imageFile = req.files && req.files['image'] ? req.files['image'][0] : null;
    const audioFile = req.files && req.files['audio'] ? req.files['audio'][0] : null;

    // Validate inputs
    if (!name || !desc || !imageFile || !audioFile) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    // Upload audio to Cloudinary
    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: 'video', // Cloudinary uses 'video' for audio files
    });

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: 'image',
    });

    // Clean up temporary files
    fs.unlinkSync(audioFile.path);
    fs.unlinkSync(imageFile.path);

    // Format duration
    const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60).toString().padStart(2, '0')}`;

    // Prepare song data
    const songData = {
      name,
      desc,
      album: album === 'none' ? null : album,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration,
      artist
    };

    // Save to MongoDB
    const song = new songModel(songData);
    await song.save();

    res.json({ success: true, message: 'Song added successfully' });
  } catch (error) {
    console.error('Error adding song:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

const listSong = async (req, res) => {
    try {
        const allSongs = await songModel.find({});
        res.json({ success: true, songs: allSongs });


    } catch (error) {
        res.json({ success: false });
    }

}
const removeSong = async (req, res) => {
    try {
        await songModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Song Removed " });

    } catch (error) {
        res.json({success:false});


    }


}

const searchSongs = async (req, res) => {
  try {
    const { query, filterType } = req.query;
    const field = filterType === "artist" ? "desc" : filterType; // Adjust if artist field added
    const songs = await songModel.find({
      [field]: { $regex: query, $options: "i" },
    });
    res.json({ success: true, songs });
  } catch (error) {
    res.json({ success: false });
  }
};


export { addSong, listSong, removeSong, searchSongs }