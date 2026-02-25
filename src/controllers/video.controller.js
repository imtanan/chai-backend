import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const filter = {};
  if (query) {
    filter.title = { $regex: query, $options: "i" };
  }

  if (userId) {
    filter.owner = userId;
  }
  const sortOptions = {}; //.sort()expects an object so we've created an object
  if (sortBy) {
    sortOptions[sortBy] = sortType === "desc" ? -1 : 1; // the format generally is like .sort({views: -1}) , if sortBy is views(just example) so we need actual value of sortBy instead of sortBy itself which is why we put it in []to get its val
  }
  if (!sortBy) {
    sortOptions.createdAt = -1;
  }
  const getVids = await Video.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNumber);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        getVids,
        "Here are the All videos that you have required"
      )
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if (!title || !description) {
    throw new ApiError(404, "title and description are required");
  }
  const localVideoPath = req.files?.videoFile[0]?.path;
  const localThumbnailPath = req.files?.thumbnail[0]?.path;
  if (!localVideoPath || !localThumbnailPath) {
    throw new ApiError(400, "Video and thumbnail are required");
  }

  const uploadedVideo = await uploadOnCloudinary(localVideoPath);
  const uploadedThumbnail = await uploadOnCloudinary(localThumbnailPath);
  if (!uploadedVideo?.url) {
    throw new ApiError(500, "Video upload failed");
  }
  if (!uploadedThumbnail?.url) {
    throw new ApiError(500, "Thumbnail upload failed");
  }
  const video = await Video.create({
    title,
    description,
    videoFile: uploadedVideo.url,
    thumbnail: uploadedThumbnail.url,
    duration: uploadedVideo.duration,
    owner: req.user._id,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, video, "The video has been created Successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "This video does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Here is the required video"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "Title and Descritpion are required");
  }
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  const userId = req.user._id;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "No Thumbnail Found");
  }
  const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!uploadedThumbnail?.url) {
    throw new ApiError(500, "Thumbnail upload failed");
  }
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid User ID");
  }

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findOneAndUpdate(
    {
      _id: videoId,
      owner: userId,
    },
    {
      $set: {
        title,
        description,
        thumbnail: uploadedThumbnail.url,
      },
    },
    { new: true }
  );

  if (!video) {
    throw new ApiError(400, "This video does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Your video has been updated Successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  const video = await Video.findOneAndDelete({
    _id: videoId,
    owner: req.user._id,
  });
  if (!video) {
    throw new ApiError(404, "Video not found or you are not the owner");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        video,
        "The selected video has been deleted Successfuly"
      )
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }
  const video = await Video.findOne({
    _id: videoId,
    owner: req.user._id,
  });
  if (!video) {
    throw new ApiError(404, "Video does not exist or unauthorized access");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        video,
        video.isPublished
          ? "The video has been published successfully"
          : "The video is unpublished"
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
