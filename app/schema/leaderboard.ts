import mongoose from "mongoose";

// Define the leaderboard schema
const leaderboardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: String, required: true },
    bestTime: { type: Number, required: true },
    date: { type: Date, default: Date.now }, // Store the current date and time by default
});

// Create a Mongoose model based on the schema
const Leaderboard = mongoose.models.Leaderboard || mongoose.model("Leaderboard", leaderboardSchema);

export default Leaderboard;
