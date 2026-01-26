import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!videoId?.trim()) {
    throw new ApiError(400, "No video Id received");
  }
  const comments = await Comment.aggregate([
    {
      $match: { video: new mongoose.Types.ObjectId(videoId) },
    },
    {
      $skip: Number(page - 1) * Number(limit),
    },
    {
      $limit: Number(limit),
    },
  ]);
  if (!comments.length) {
    throw new ApiError(404, "No comments found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched Successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  if (!videoId?.trim()) {
    throw new ApiError(400, "No video Id received");
  }

  const content = req.body.content;
  if (!content?.trim()) {
    throw new ApiError(400, "No content received");
  }

  const comment = await Comment.create({
    content: content,
    video: videoId,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added Successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;
  if (!commentId?.trim()) {
    throw new ApiError(400, "Comment ID is required");
  }
  if (!content?.trim()) {
    throw new ApiError(400, "Content is required");
  }
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "you can only update your own comment");
  }

  comment.content = content;
  const updatedComment = await comment.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedComment, "Comment updated Successfully!")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  if (!commentId?.trim()) {
    throw new ApiError(400, "Comment ID not Found");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(400, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    // we will add a condition for the channel owner so he could delete others comments tooo
    throw new ApiError(403, "you can only Delete your own comment");
  }

  const deletedComment = await comment.remove();
  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedComment, "Comment deleted Successfully!")
    );
});

export { getVideoComments, addComment, updateComment, deleteComment };
