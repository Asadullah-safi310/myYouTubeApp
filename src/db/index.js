import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}/${DB_Name}`);
        console.log(` \n MongoDB Database connected !! DB HOST: ${connectionInstance.connection.host} DB NAME: ${connectionInstance.connection.name} \n`);
    } catch (error) {
        console.log("MongoDB connection error : ",error);
        process.exit(1);
    }
}

export default connectDB;