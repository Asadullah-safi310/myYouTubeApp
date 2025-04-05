import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}/${DB_Name}`);
        console.log(` \n MongoDB Database connected !! DB HOST: ${connectionInstance.connection.host} DB NAME: ${connectionInstance.connection.name} \n`);
    } catch (error) {
        console.log("MongoDB connection error : ",error);
        throw error;  // ❌ Throwing error will reject the function or promise
        // process.exit(1);  // ❌ This will stop the execution of the program, so the .catch() block will not execute.
    }
} 

export default connectDB;








/* 
use async function to connect to the database using mongoose because the database connection takes time.
use try-catch block to handle errors while connecting to the database.
*/


/* 
If you call connectDB(), the function doesn’t return anything (so it implicitly(automatically ) resolves even on failure).
if you want to reject the promise throw error; instead of process.exit(1) in .catch() block;
*/

// If you want to stop the execution of the program, use process.exit(1); in the catch block of connectDB() function.

//? if you throw error the promise will be rejected and the .catch() block in index.js file will execute and show this error: console.log("mongoDB connection failed!!", err);