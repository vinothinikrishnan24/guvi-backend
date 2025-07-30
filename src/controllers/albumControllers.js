import { v2 as cloudinary } from "cloudinary";
import albumModel from "../models/albumModel.js";
import fs from "fs";

const addAlbum = async (req, res) => {
  try {
    const { name, desc, bgColour } = req.body;
    const imageFile = req.file;
    if (!name || !desc || !bgColour || !imageFile) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    fs.unlinkSync(imageFile.path);
    const albumData = {
      name,
      desc,
      bgColour,
      image: imageUpload.secure_url,
      likes: 0,
      comments: [],
    };
    const album = new albumModel(albumData);
    await album.save();
    res.json({ success: true, message: "Album added successfully" });
  } catch (error) {
    console.error("Error adding album:", error);
    res.status(500).json({ success: false, error: error.message || "Server error" });
  }
};

const listAlbum = async (req, res) => {
  try {
    const allAlbums = await albumModel.find({});
    res.json({ success: true, albums: allAlbums });
  } catch (error) {
    res.json({ success: false });
  }
};

const removeAlbum = async (req, res) => {
  try {
    await albumModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Album Removed" });
  } catch (error) {
    res.json({ success: false });
  }
};

const likeAlbum = async (req, res) => {
  try {
    const { albumId } = req.body;
    const album = await albumModel.findById(albumId);
    if (!album) {
      return res.status(404).json({ success: false, error: "Album not found" });
    }
    album.likes += 1;
    await album.save();
    res.json({ success: true, likes: album.likes });
  } catch (error) {
    console.error("Error liking album:", error);
    res.json({ success: false });
  }
};

const commentAlbum = async (req, res) => {
  try {
    const { albumId, comment } = req.body;
    const album = await albumModel.findById(albumId);
    if (!album) {
      return res.status(404).json({ success: false, error: "Album not found" });
    }
    album.comments.push({ text: comment, user: "User" });
    await album.save();
    res.json({ success: true, comments: album.comments });
  } catch (error) {
    console.error("Error commenting on album:", error);
    res.json({ success: false });
  }
};

const getAlbumInteractions = async (req, res) => {
  try {
    const album = await albumModel.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ success: false, error: "Album not found" });
    }
    res.json({ success: true, likes: album.likes, comments: album.comments });
  } catch (error) {
    console.error("Error fetching album interactions:", error);
    res.json({ success: false });
  }
};

const searchAlbums = async (req, res) => {
  try {
    const { query, filterType } = req.query;
    if (!query || !filterType) {
      return res.status(400).json({ success: false, error: "Query and filterType are required" });
    }
    const field = filterType === "artist" ? "desc" : filterType; // Albums use desc for artist
    const albums = await albumModel.find({
      [field]: { $regex: query, $options: "i" },
    });
    res.json({ success: true, albums });
  } catch (error) {
    console.error("Error searching albums:", error);
    res.json({ success: false });
  }
};

export { addAlbum, listAlbum, removeAlbum, likeAlbum, commentAlbum, getAlbumInteractions, searchAlbums };