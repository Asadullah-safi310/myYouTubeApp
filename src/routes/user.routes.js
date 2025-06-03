import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
//import the middleware from the multer.middleware.js file to upload files
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1},   //The name of the field from the frontend (input name attribute)
        { name: "coverImage", maxCount: 1}  //	Max number of files to accept for that field
    ]),
    registerUser
)


router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)

export default router;








//? Note
/*
You're telling Multer:
"Look for a field named avatar in the incoming form data, and expect it to contain a file (or up to maxCount files). Same with coverImage."
*/


//?After this middleware runs...
// The uploaded files will be available in the req.files object inside your registerUser method in the user.controller.js file , like:
/*
req.files = {
    avatar: [ { ...fileData } ],
    coverImage: [ { ...fileData } ]
  };

*/
// If you do not use the upload.fields() middleware in this route
// You won’t be able to access uploaded images (avatar, coverImage), and req.files or req.file will be undefined
// The files won’t be parsed, saved, or available anywhere.
// No file will be stored in your uploads folder or cloud service (if you use one like Cloudinary, S3, etc.).


//? You can use other methods in upload
// If you are only uploading one file, you'd use:
// upload.single('avatar')  //  avatar is the name of the field from the frontEnd

// If you're uploading many files under the same field (e.g., multiple images), you'd use:
// upload.array('avatar', 5)

// for multiple fields with one or more files each, you use:
// upload.fields([...])


//? Note:
// Each middleware can read and modify req or res, and pass them on using next().



//? Visula Diagram of Request flow:
/*
[ Frontend Request ]
        |
        ↓
┌────────────────────────────┐
│ Middleware: upload.fields()│  → Adds req.files
└────────────────────────────┘
        ↓ next()
┌────────────────────────────┐
│ Middleware: verifyJWT    │  → Adds req.user
└────────────────────────────┘
        next()
          ↓
┌────────────────────────────┐
│ Controller: registerUser   │  → Uses req.files, req.user, req.body
└────────────────────────────┘
        ↓
[ Response Sent to Frontend ]


*/