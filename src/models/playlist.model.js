import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ]
       
    
}, {
    timestamps: true
}
)

playlistSchema.plugin(mongooseAggregatePaginate); // Add pagination to the playlist schema
export const Playlist = mongoose.model("Playlist", playlistSchema)
