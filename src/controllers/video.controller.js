import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiError } from "../utils/ApiError.js"


const getAllVideos = asyncHandler(async (req, res) => {
    // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    // //TODO: get all videos based on query, sort, pagination

    // const filter = {}
    // if (query) {
    //     filter.title = { $regex: query, $options: "i" }
    // }
    // if (userId) {
    //     filter.owner = userId
    // }

    // const sortOptions = {}
    // sortOptions[sortBy] = sortType === "asc" ? 1 : -1

    // const videos = await Video.find(filter)
    //     .populate("owner", "username")
    //     .sort(sortOptions)
    //     .skip((page - 1) * limit)
    //     .limit(Number(limit))

    // const total = await Video.countDocuments(filter)

    // res.status(200).json(
    //     new ApiResponse(
    //         true,
    //         "Videos fetched successfully",
    //         {
    //             videos,
    //             total,
    //             page: Number(page),
    //             limit: Number(limit)
    //         }
    //     )
    // )
console.log("..........req.user._id", req.user._id)
const videos = await Video.find({ owner: req.user._id }) // filter by owner
  .populate("owner", "username email");

res.status(200).json(
  new ApiResponse(
    true,
    "Videos fetched successfully",
    { videos }
  )
);

}
)

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, duration, views, owner} = req.body
    // TODO: get video, upload to cloudinary, create video
    if (!title || !description || !duration || !views ) {
        throw new ApiError(400, "All fields are required")
    }

    //get video
    const localVideoFilePath = req.files?.videoFile[0].path
    if (!localVideoFilePath){
        throw new ApiError(400, "No video file uploaded")
    }
    //upload video to cloudinary
    const videoFileUpload = await uploadOnCloudinary(localVideoFilePath)
    if (!videoFileUpload?.url){
        throw new ApiError(500, "Video upload failed")
    }
    //get thumbnail
    const localThumbnailFilePath = req.files?.thumbnail[0].path
    if (!localThumbnailFilePath){
        throw new ApiError(400, "No thumbnail file uploaded")
    }
    //upload thumbnail to cloudinary
    const UploadThumbnailFile = await uploadOnCloudinary(localThumbnailFilePath)
    if (!UploadThumbnailFile?.url){
        throw new ApiError(500, "Thumbnail upload failed")
    } 
    //create video
    const video = await Video.create({
        title,
        description,
        videoFile: videoFileUpload.url,
        thumbnail: UploadThumbnailFile.url,
        owner: req.user._id,
        duration,
        views,
        

    })

    //response to the frontend
    res.status(201).json(
        new ApiResponse(
            true,
            "Video published successfully",
            { video }
        )
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!isValidObjectId(videoId)) return res.status(400).json({ success: false, message: "Invalid video ID" })

    const video = await Video.findById(videoId).populate("owner", "username email")
    if (!video) return res.status(404).json({ success: false, message: "Video not found" })

    res.status(200).json(
        new ApiResponse(
            true,
            "Video fetched successfully",
            { video }
        )
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { title, description } = req.body

    const updated = await Video.findByIdAndUpdate(videoId, { title, description }, { new: true, runValidators: true })
    if (!updated) return res.status(404).json({ success: false, message: "Video not found" })

    res.status(200).json(
        new ApiResponse(
            true,
            "Video updated successfully",
            { video: updated }
        ))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const deleted = await Video.findByIdAndDelete(videoId)
    if (!deleted) return res.status(404).json({ success: false, message: "Video not found" })

    res.status(200).json(
        new ApiResponse(
            true,
            "Video deleted successfully",
            { video: deleted }
        )
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)
    if (!video) return res.status(404).json({ success: false, message: "Video not found" })

    video.isPublished = !video.isPublished
    await video.save()

    res.status(200).json(new ApiResponse(
        true,
        `Video ${video.isPublished ? "published" : "unpublished"} successfully`,
        { video }
    ))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}