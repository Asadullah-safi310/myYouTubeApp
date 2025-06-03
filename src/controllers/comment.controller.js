import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if (!mongoose.isValidObjectId(videoId)) {
        return res.status(400).json({message: "Invalid video ID"})
    }
    const comments = await Comment.find({video: videoId})
        .populate("owner", "fullName username avatar")
        .sort({createdAt: -1})
        .skip((page - 1) * limit)
        .limit(Number(limit))

    const totalComments = await Comment.countDocuments({video: videoId})
    res.status(200).json(
        new ApiResponse(200, "Comments fetched successfully", {
            comments,
            totalComments,
        })
    )

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId, content }  = req.body
    if (!mongoose.isValidObjectId(videoId)) {
        return res.status(400).json({message: "Invalid video ID"})
    }
    if (!content) {
        return res.status(400).json({message: "Comment content is required"})
    }
    const comment = await Comment.create({
        content,
        video:videoId,
        owner: req.user._id,
    })
    const populatedComment = await comment.populate("owner", "fullName username avatar")
    res.status(201).json(
        new ApiResponse(201, "Comment added successfully", {
            comment: populatedComment,
        })
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { content } = req.body
    if (!mongoose.isValidObjectId(commentId)) {
        return res.status(400).json({message: "Invalid comment ID"})
    }
    if (!content) {
        return res.status(400).json({message: "Comment content is required"})
    }

    const comment = await Comment.findById(commentId)
    if (!comment) {
        return res.status(404).json({message: "Comment not found"})
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({message: "You are not authorized to update this comment"})
    }
    comment.content = content
    await comment.save() //after this the comment object will contain the updated values that were saved to the database.

    res.status(200).json(
        new ApiResponse(200, "Comment updated successfully", {
            comment,
        })
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params
    if (!mongoose.isValidObjectId(commentId)) {
        return res.status(400).json({message: "Invalid comment ID"})
    }
    const comment = await Comment.findById(commentId)
    if (!comment) {
        return res.status(404).json({message: "Comment not found"})
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({message: "You are not authorized to delete this comment"})
    }
    await comment.deleteOne()
    res.status(200).json(
        new ApiResponse(200, "Comment deleted successfully", {})
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }