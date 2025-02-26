// lib/types.d.ts

declare global {
    interface LeaderboardProps {
        _id?: string; // Only for MongoDB
        name: string;
        level: string;
        bestTime: string;
        date: string;
    }
}

export { }; 