import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongoDB";
import Leaderboard from "@/app/schema/leaderboard";

// Define a type for the query filter
type LeaderboardQuery = {
    level?: string;
    date?: { $gte: Date };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect(); // Ensure database is connected

    if (req.method === "POST") {
        // Save a new leaderboard entry
        const { name, level, bestTime } = req.body;

        if (!name || !level || bestTime === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const newEntry = new Leaderboard({ name, level, bestTime });
            await newEntry.save();
            return res.status(201).json({ message: "Leaderboard entry saved successfully." });
        } catch (error) {
            return res.status(500).json({ errorMessage: "Error saving leaderboard entry. Error: ", error });
        }
    } else if (req.method === "GET") {
        // Get the 'level' and 'date' query parameters from the request
        const { level, date } = req.query;

        try {
            // If 'date' is 'today', filter leaderboard entries to today only
            const query: LeaderboardQuery = {};

            if (level) {
                query.level = level as string;
            }

            if (date === "today") {
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0); // Set to midnight of today
                query.date = { $gte: startOfDay }; // Filter entries with date >= start of today
            }

            const topPlayers = await Leaderboard.find(query)
                .sort({ bestTime: 1 }) // Sort by fastest time (ascending)
                .limit(10); // Limit to top 10 players

            return res.status(200).json(topPlayers);
        } catch (error) {
            return res.status(500).json({ errorMessage: "Error fetching leaderboard. Error:", error });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
