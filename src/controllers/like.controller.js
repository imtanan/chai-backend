import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "No user ID received");
  }
  //TODO: toggle like on video
  const checkExistence = await Like.findOne({
    video: videoId,
    likedBy: userId,
  });
  if (!checkExistence) {
    await Like.create({
      video: videoId,
      likedBy: userId,
    });

    return res.status(200).json({
      success: true,
      message: "Video liked",
    });
  } else {
    await Like.deleteOne({
      video: videoId,
      likedBy: userId,
    });
    return res.status(200).json({
      success: true,
      message: "Video unliked",
    });
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment ID");
  }
  //TODO: toggle like on comment
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "No user ID received");
  }
  const checkExistence = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });
  if (!checkExistence) {
    await Like.create({
      comment: commentId,
      likedBy: userId,
    });

    return res.status(200).json({
      success: true,
      message: "Comment liked",
    });
  } else {
    await Like.deleteOne({
      comment: commentId,
      likedBy: userId,
    });
    return res.status(200).json({
      success: true,
      message: "Comment unliked",
    });
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet ID");
  }
  //TODO: toggle like on tweet

  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "No user ID received");
  }
  const checkExistence = await Like.findOne({
    tweet: tweetId,
    likedBy: userId,
  });
  if (!checkExistence) {
    await Like.create({
      tweet: tweetId,
      likedBy: userId,
    });

    return res.status(200).json({
      success: true,
      message: "Tweet liked",
    });
  } else {
    await Like.deleteOne({
      tweet: tweetId,
      likedBy: userId,
    });
    return res.status(200).json({
      success: true,
      message: "Tweet unliked",
    });
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "No user ID received");
  }
  const likedVids = await Like.find({
    likedBy: userId,
    video: { $exists: true },
  }).populate("video");
  if (likedVids.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "You have not liked any video yet"));
  }
  const videos = likedVids.map((like) => like.video);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        videos,
        "Here is the list of videos that you have liked"
      )
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
