import dbConnect from "@/lib/mongoDB";
import Leaderboard from "@/app/schema/leaderboard";
import { NextResponse } from 'next/server';

// Define a type for the query filter
type LeaderboardQuery = {
    level?: string;
    date?: { $gte: Date };
};

export async function GET(request: Request) {
    await dbConnect(); // Ensure database is connected
    
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        
        // Build the query
        const query: LeaderboardQuery = {};
        
        if (date === "today") {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            query.date = { $gte: startOfDay };
        }
        
        const topPlayers = await Leaderboard.find(query)
            .sort({ bestTime: 1 })
            .limit(10);
            
        // If no data is found, return an empty array instead of throwing an error
        return NextResponse.json(topPlayers || []);
        
    } catch (error) {
        console.error("Leaderboard fetch error:", error);
        return NextResponse.json({ error: "Error fetching leaderboard data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();

    try {
        const body = await request.json();
        const { name, level, bestTime, date } = body;

        if (!name || !level || bestTime === undefined) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const newEntry = new Leaderboard({
            name,
            level,
            bestTime,
            date: date || new Date().toISOString()
        });

        await newEntry.save();

        return NextResponse.json(
            { message: "Leaderboard entry saved successfully" },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error saving leaderboard entry:", error);
        return NextResponse.json(
            { error: "Error saving leaderboard entry" },
            { status: 500 }
        );
    }
}
