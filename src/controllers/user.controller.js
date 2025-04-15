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

    // Search inside User collection(table) and return any record where either the username field matches the given username, or the email field matches the given email, If it finds, throw an error with status code 409 and message "User already exists"
    const existedUser = await User.findOne(
        {
            $or: [
                { username }, //look for a document(record) in the User collection(table) in the database where the username field matches the value of the username variable.
                { email }  // look for a document(record) in the User collection(table) in the database where the email field matches the value of the email variable.
            ]
        }
    )
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }


    const avatarLocalPath = req.files?.avatar[0].path; // get the avatar path from the request files
    
    if ( !avatarLocalPath ){
      throw new ApiError(400, "Avatar is required")
      }

    let coverImageLocalPath;
    if ( req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path; // get the cover image path from the request files
    }
   
    // upload the avatar and cover image to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath); // upload the avatar to cloudinary
    const coverImage = await uploadOnCloudinary(coverImageLocalPath); // upload the cover image to cloudinary

    if (!avatar){
        throw new ApiError(400, "Avatar is required")
    }

    //Create new user in DB
    const  user = await User.create({
        username: username.toLowerCase(), // convert the username to lowercase
        email,  //In this line, email will automatically map to the email column in the database without the need to write email: email.
        password,  // same as: password: password
        fullName: username,
        avatar: avatar.url, // get the url from the response
        coverImage: coverImage?.url || "", // get the url from the response
    })

    // if the user is created successfully, send a response with status code 201 and message "User created successfully"
    const createdUser = await User.findById(user._id).select("-password -refreshtoken"); //findById is a Mongoose query method that retrieves a user from the database by their _id (that was just created in the previous line by User.create(), The _id field is automatically created with every record or entry in the DB when the user is created with User.create().) and ensures that sensitive fields like password and refreshtoken are excluded from the result.
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

  return res.status(200).json(
    new ApiResponse(201, "User created successfully", createdUser)
  );
});

export { registerUser };






















//? ...........................req object ..............................
/*
{
  body: {

    /// ✅ All form field inputs (text data from frontend)
    username: "username",        // <input name="username" />
    email: "email",              // <input name="email" />
    password: "password",        // <input name="password" />
    fullName: "fullName",        // <input name="fullName" />
     ...any other input fields
  },

  files: {
    /// ✅ All uploaded files are grouped by the field names from frontend
    /// ✅   In the req.files object, the field names from the frontend form become the keys in the files object.
    avatar: [
      {
        fieldname: "avatar",                   // name of the input field (from frontend)
        originalname: "profile.png",           // original file name from user
        encoding: "7bit",
        mimetype: "image/png",                 // file type
        destination: "uploads/",               // folder where file is saved
        filename: "1711234567890-profile.png", // renamed file
        path: "uploads/1711234567890-profile.png", // full path to file
        size: 14523                            // file size in bytes
      }
    ],

    coverImage: [
      {
        fieldname: "coverImage",
        originalname: "cover.jpg",
          ...same structure as above
      }
    ],

    documents: [
      {
        fieldname: "documents",                // input name="documents"
        originalname: "resume.pdf",
        mimetype: "application/pdf",
        destination: "uploads/",
        filename: "17123456789-resume.pdf",
        path: "uploads/17123456789-resume.pdf",
        size: 90000
      },
      {
        fieldname: "documents",
        originalname: "certification.jpg",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "17123456790-certification.jpg",
        path: "uploads/17123456790-certification.jpg",
        size: 23000
      }
    ]
  }
}
*/

//?................Mismatch between FrontEnd and BackEnd.........................
// If there were a mismatch (like if the frontend uses user_email but your DB column is email), you would need to explicitly write the mapping like so:
// email: user_email  // If frontend sends `user_email` and backend expects `email`


//? .................The uploadOnCloudinary function ..............................................
// Assuming that uploadOnCloudinary(avatarLocalPath) uploads the image to Cloudinary (or another cloud service), this function will return an object that includes the URL of the uploaded file.
// const avatar = await uploadOnCloudinary(avatarLocalPath);
// This could return an object like this:
/*

{
  url: "https://res.cloudinary.com/your-cloud-name/image/upload/v123456789/your-avatar.jpg",
  public_id: "your-avatar"
}

The avatar.url value would be the URL string: "https://res.cloudinary.com/your-cloud-name/image/upload/v123456789/your-avatar.jpg"

*/



//? ................User.create() method returns ......................................
//*  User.create() returns the newly created user document with all its fields and the unique _id.

/*
{
  _id: ObjectId("uniqueObjectId"),
  username: "johnDoe",
  email: "john@example.com",
  password: "password123",
  __v: 0 // version key (automatically added by Mongoose)
}
*/


