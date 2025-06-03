import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweets);

//When the client sends a PATCH request to /tweets/:tweetId, the updateTweet controller function will be called.When the client sends a DELETE request to /tweets/:tweetId, the deleteTweet controller function will be called.
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router