import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, _, next) => {
    console.log("req in verifyJWT middleware", req);

  try {
    const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401,"Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select("-password -refreshtoken");

    if (!user) {
      throw new ApiError(401,"Invalid Access Token");
    }

    req.user = user;  //You're manually adding a new custom property (user) to the existing req (request) object.

    next();  //passes the updated req to the next function, in this case the function is: logoutUser
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
})

export { verifyJWT };


//Note: _ is used as a placeholder for res (response), meaning you’re not using it in this function.

// when the user in not logedIn the req.cookies will be null

/*
if the backend set the tokens in cookies (like accessToken or refreshToken during login), the browser Will store the cookies, BUT
Won’t include them in future requests(req.cookies) to the backend unless {withCredentials: true} is specified by the frontEnd when request through axios or others.
*/