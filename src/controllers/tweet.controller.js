import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  const userId = req.user._id;
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content cannot be empty");
  }
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }
  const tweet = await Tweet.create({
    content,
    owner: userId,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Your tweet has been created"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const userId = req.user._id;
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }
  const tweet = await Tweet.find({ owner: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Here are your tweets"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const userId = req.user._id;
  const { content } = req.body;
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content cannot be empty");
  }

  if (!mongoose.isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }
  const tweet = await Tweet.findOneAndUpdate(
    {
      _id: tweetId,
      owner: userId,
    },
    {
      $set: { content },
    },
    {
      new: true,
    }
  );
  if (!tweet) {
    throw new ApiError(400, "Tweet not found or unauthorized");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Here are your tweets"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  const userId = req.user._id;
  if (!mongoose.isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet ID");
  }

  const tweet = await Tweet.findOneAndDelete({
    _id: tweetId,
    owner: userId,
  });
  if (!tweet) {
    throw new ApiError(404, "Unauthorized access");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, tweet, "Your Tweet has been deleted Successfully")
    );
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
