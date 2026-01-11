import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL;

let isConnected = false;

async function dbConnect() {

    if (isConnected) {
        console.log("Already connected to the database");
        return;
    }

    try {
        const db = await mongoose.connect(MONGODB_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("Database connected successfully", db);
    } catch (error) {
        console.log("Database connection failed", error);
        throw error;
        
    }
}
export default dbConnect;