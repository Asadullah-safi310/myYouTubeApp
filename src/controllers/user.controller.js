import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/Apiresponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;

  // if any of the fields are empty, throw an error with status code 400 and message "All fields are required"
  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

    // if the user is already registered, throw an error with status code 409 and message "User already exists"
    const existedUser = User.findOne(
        {
            $or: [
                { username },
                { email }
            ]
        }
    )
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }


    const avatarLocalPath = req.files?.avatar[0].path; // get the avatar path from the request files
    const coverImageLocalPath = req.files?.coverImage[0].path; // get the cover image path from the request files
    if ( !avatarLocalPath ){
        throw new ApiError(400, "Avatar is required")
    }

    // upload the avatar and cover image to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath); // upload the avatar to cloudinary
    const coverImage = await uploadOnCloudinary(coverImageLocalPath); // upload the cover image to cloudinary

    if (!avatar){
        throw new ApiError(400, "Avatar is required")
    }

    const  user = await User.create({
        username: username.toLowerCase(), // convert the username to lowercase
        email,
        password,
        fullName: username,
        avatar: avatar.url, // get the url from the response
        coverImage: coverImage?.url || "", // get the url from the response
    })

    // if the user is created successfully, send a response with status code 201 and message "User created successfully"
    const createdUser = await User.findById(user._id).select("-password -refreshtoken"); // get the user without password and __v field
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

  return res.status(200).json(
    new ApiResponse(201, "User created successfully", createdUser)
  );
});

export { registerUser };
