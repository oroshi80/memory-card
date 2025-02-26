import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type LeaderboardProps = {
  name: string;
  level: string;
  bestTime: number;
  date: string;
};

export const Leaderboard = () => {
  const [data, setData] = useState<LeaderboardProps[]>([]);
  const [dateFilter, setDateFilter] = useState<"today" | "all-time">(
    "all-time"
  );

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/leaderboard?date=${dateFilter}`);

        const json = await response.text();
        const parsedData = json ? JSON.parse(json) : [];

        setData(parsedData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, [dateFilter]);

  return (
    <>
      <div className="flex gap-2">
        <Button onClick={() => setDateFilter("today")}>Today</Button>
        <Button onClick={() => setDateFilter("all-time")}>All Time</Button>
      </div>
      <Table>
        <TableCaption>A list of top players.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Best Time</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.name}</TableCell>
                <TableCell>{entry.level}</TableCell>
                <TableCell>{entry.bestTime}</TableCell>
                <TableCell>
                  {new Date(entry.date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};
