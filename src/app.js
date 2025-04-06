import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();


// CORS Specifies which origins (domains) are allowed to access the server
app.use(cors({
    origin: process.env.CORS_ORIGIN,    //The origin: process.env.CORS_ORIGIN part ensures that only requests coming from this URL can access your API.
    credentials: true,     // Cookies and authentication headers will be sent with requests.
}))



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


//! Import routes
import userRouter from './routes/user.routes.js';

// if the user enters this : //http:localhost:5000/api/v1/users/register
app.use("/api/v1/users", userRouter); 


export default app; 







// middleware : is used in the middle of the request-response cycle to check if user which request is authenticated or not, logged in or not, admin or not, etc.
 