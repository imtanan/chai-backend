import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }
  //TODO: create playlist
  const { videoId } = req.params;
  const userId = req.user._id;
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id");
  }

  if (videoId && !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }

  const createdPlaylist = await Playlist.create({
    name,
    description,
    videos: [videoId],
    owner: userId,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdPlaylist,
        "Playlist has been created successfully"
      )
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid User ID");
  }
  //TODO: get user playlists
  const playlist = await Playlist.find({
    owner: userId,
  });
  if (playlist.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "No playlist created"));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlist,
        "Here are the lists of playlists of this user"
      )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid Playlist ID");
  }
  //TODO: get playlist by id
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const userId = req.user._id;
  if (
    !mongoose.isValidObjectId(playlistId) ||
    !mongoose.isValidObjectId(videoId)
  ) {
    throw new ApiError(404, "Invalid playlist or video ID");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  // Optional: Check ownership (important for security)
  if (playlist.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to modify this playlist");
  }

  playlist.videos.push(videoId);
  await playlist.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlist,
        "Video has been added to playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  const userId = req.user._id;
  if (
    !mongoose.isValidObjectId(playlistId) ||
    !mongoose.isValidObjectId(videoId)
  ) {
    throw new ApiError(404, "Invalid playlist or video ID");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  // Optional: Check ownership (important for security)
  if (playlist.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to modify this playlist");
  }
  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $pull: { videos: videoId } },
    { new: true }
  );
  await playlist.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Video removed successfully from the playlist"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user._id;
  // TODO: delete playlist
  if (
    !mongoose.isValidObjectId(playlistId) ||
    !mongoose.isValidObjectId(userId)
  ) {
    throw new ApiError(404, "Invalid playlist or user ID");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (playlist.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to delete this playlist");
  }
  await Playlist.findByIdAndDelete(playlistId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  const userId = req.user._id;
  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(404, "Invalid playlist ID");
  }
  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }

  const updatedPlaylist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: userId,
    },
    {
      $set: {
        name,
        description,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedPlaylist) {
    throw new ApiError(404, "Playlist not found or you are not authorized");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Your playlist has been updated successfully"
      )
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
