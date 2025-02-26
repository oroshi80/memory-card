import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || "memoryGame"; // Your database name

let cachedDb: mongoose.Connection | null = null;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable.");
}

async function dbConnect() {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        // Connect to MongoDB using Mongoose
        await mongoose.connect(MONGODB_URI, {
            dbName: MONGODB_DB, // Set the database name
        });

        cachedDb = mongoose.connection;

        // Optional: Add event listeners for debugging or monitoring connection
        cachedDb.once("open", () => {
            console.log("MongoDB connected successfully.");
        });

        return cachedDb;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error("Failed to connect to MongoDB");
    }
}

export default dbConnect;
