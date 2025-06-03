import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body;
    if(!content){
        throw new ApiError(400, "Content is required")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id,
    })

    res.status(200).json(
        new ApiResponse(201, "Tweet created successfully", {
            tweet,
        })
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get specific user tweets
    const { userId } = req.params
    if ( !isValidObjectId( userId ) ) {
        throw new ApiError(400, "Invalid user id")
    }

    const tweet = await Tweet.find({ owner: userId })
     .populate("owner", "fullName username avatar")
     .sort({ createdAt: -1 });


    res.status(200).json(
        new ApiResponse(201, "Tweets fetched successfully", {
            tweet,
        })
    )
    
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params
    const { content } = req.body

    if ( !isValidObjectId( tweetId ) ) {
        throw new ApiError(400, "Invalid tweet id")
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId, // find tweet by id
        {
            content:content, //only update content field
        },
        {
            new: true, //Tells Mongoose to return the updated document instead of the original one.
            runValidators: true, //Mongoose schema validations are applied during the update
        }
    )
    
    res.status(200).json(
        new ApiResponse(200, "Tweet updated successfully", {
            tweet,
        })
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params
    if ( !isValidObjectId( tweetId ) ) {
        throw new ApiError(400, "Invalid tweet id")
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }

    if ( tweet.owner.toString() !== req.user._id.toString() ) {
        throw new ApiError(403, "You are not authorized to delete this tweet")
    }
    await tweet.deleteOne() // deletes that tweet from DB
    res.status(200).json(
        new ApiResponse(200, "Tweet deleted successfully", {
            tweet,
        })
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}