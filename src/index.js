import connectDB from "./db/index.js";
// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import app from "./app.js";

// this is for the configuration for the .env file, this allow us to access the environment variables from the .env file
dotenv.config({
    path: "./env"
});

const port = process.env.PORT || 8000;
connectDB().then(()=>{
    app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`);   
    })
    app.on("error", (err)=>{
        console.log("Server error: ", err);
    })
}).catch((err)=>{
    console.log("mongoDB connection failed!!", err);
})




// If connectDB() fails, the .catch((err) => { console.log("mongoDB connection failed!!", err); }) will not execute because process.exit(1) has already stopped the execution.

/* 
If the server starts but encounters an Express-related error (not a DB error), app.on("error", ...) will catch it.
For example, if the port is already in use or there’s an unexpected crash in Express middleware, this handler will log the error.
*/


// .then() and .catch() will never run if process.exit(1); is executed inside connectDB() in db/index.js file.