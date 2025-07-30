import playlistModel from "../models/playListModel.js";

const addPlaylist = async (req, res) => {
  try {
    const { name, desc } = req.body;
    if (!name || !desc) {
      return res.status(400).json({ success: false, error: "Name and description are required" });
    }
    const playlist = new playlistModel({ name, desc, songs: [] });
    await playlist.save();
    res.json({ success: true, playlist });
  } catch (error) {
    console.error("Error adding playlist:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const listPlaylists = async (req, res) => {
  try {
    const playlists = await playlistModel.find({}).populate("songs");
    res.json({ success: true, playlists });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.json({ success: false });
  }
};

const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;
    const playlist = await playlistModel.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ success: false, error: "Playlist not found" });
    }
    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }
    const updatedPlaylist = await playlistModel.findById(playlistId).populate("songs");
    res.json({ success: true, playlist: updatedPlaylist });
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    res.json({ success: false });
  }
};

const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;
    const playlist = await playlistModel.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ success: false, error: "Playlist not found" });
    }
    playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
    await playlist.save();
    const updatedPlaylist = await playlistModel.findById(playlistId).populate("songs");
    res.json({ success: true, playlist: updatedPlaylist });
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    res.json({ success: false });
  }
};

export { addPlaylist, listPlaylists, addSongToPlaylist, removeSongFromPlaylist };