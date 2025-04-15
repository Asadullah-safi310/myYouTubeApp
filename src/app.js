import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();


// CORS Specifies which origins (domains) are allowed to access the server
app.use(cors({
    origin: process.env.CORS_ORIGIN,    //The origin: process.env.CORS_ORIGIN part ensures that only requests coming from this URL can access your API.
    credentials: true,     // Cookies and authentication headers will be sent with requests.
}))

console.log("inside app.js file");

//Parses incoming JSON requests comming from the client or frondend team and After parsing, the JSON data is accessible in req.body. Without this middleware, req.body will be undefined because the server doesn’t know how to parse JSON
app.use(express.json({
    limit: '16kb',   // Limit the request body size of JSON data to 16KB
}))



//This middleware parses incoming URL-encoded data (e.g., form submissions) and makes it available in req.body.
app.use(express.urlencoded({
    extended: true,   // Allow nested objects in URL-encoded data
    limit: '16kb',  // Limit the size of URL-encoded data
}));



app.use(express.static('public')) // Serve static files from the public directory
app.use(cookieParser()) // Parse cookies from the request headers


//! -----------Import routes-----------
import userRouter from './routes/user.routes.js';

app.use("/api/v1/users", userRouter); 


export default app; 







// middleware : is used in the middle of the request-response cycle to check if user which request is authenticated or not, logged in or not, admin or not, etc.
 


/* 
    if the user enters this : //http:localhost:5000/api/v1/users/register
   it will go to the user.routes.js file and run this route:    router.route("/register").post(registerUser)
   and then go to the user.controller.js file to run the registerUser function 
*/


//? app.use("/api/v1/users", userRouter); 
// this means that all the routes in the userRouter will be prefixed with /api/v1/users, it works as parent route
// so if you have a route in userRouter like /login, it will be accessible at /api/v1/users/login
// if you have a route in userRouter like /profile, it will be accessible at /api/v1/users/profile
// so the userRouter is the child route and the /api/v1/users is the parent route
// this is a good practice to keep the routes organized and easy to manage
