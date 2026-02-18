import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel Id");
  }

  // TODO: toggle subscription
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "User Id is required");
  }
  const isSubscribed = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });
  if (isSubscribed) {
    await Subscription.findByIdAndDelete(isSubscribed._id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Channel Unsubscribed"));
  }
  const subscribed = await Subscription.create({
    subscriber: userId,
    channel: channelId,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, subscribed, "Channel subscribed successfully"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "Channel ID missing!");
  }

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel ID!");
  }
  const channelUser = await User.findById(channelId);
  if (!channelUser) {
    throw new ApiError(404, "Channel not found!");
  }
  const getSubs = await Subscription.find({ channel: channelId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        getSubs,
        getSubs.length === 0
          ? "This channel has no subscribers yet"
          : "Here is the List of user's channel subscribers"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber Id");
  }
  const channelSubs = await Subscription.find({ subscriber: subscriberId });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelSubs,
        channelSubs.length === 0
          ? "This User has not subscribed anyone"
          : "Here is the list of subscribed channels"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
