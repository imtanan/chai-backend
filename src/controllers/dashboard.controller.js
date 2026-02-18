import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  // const { videoId }  = req.params
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "User ID not Found");
  }
  const owner = await Video.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(userId) },
    },
    {
      $group: {
        _id: null,
        totalViews: {
          $sum: "$views",
        },
        totalVids: {
          $sum: 1,
        },
      },
    },
  ]);
  if (!owner.length) {
    throw new ApiError(400, "There are no views and videos of this channel");
  }
  const videos = await Video.find({ owner: userId }, { _id: 1 }); //In Mongo:  1 = include this field ,  0 = exclude this field
  const videoIds = videos.map((v) => v._id);
  const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });
  const totalSubs = await Subscription.countDocuments({ channel: userId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalViews: owner[0].totalViews,
        totalVids: owner[0].totalVids,
        totalLikes,
        totalSubs,
      },
      "Here are the stats of this channel"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const userId = req.user._id;

  const videos = await Video.find({
    owner: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Here are the videos"));
});

export { getChannelStats, getChannelVideos };
