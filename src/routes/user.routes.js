import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
//import the middleware from the multer.middleware.js file to upload files
import { upload } from "../midddlewares/multer.middleware.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1},
        { name: "coverImage", maxCount: 1}
    ]),
    registerUser
)

export default router;