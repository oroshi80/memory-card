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
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns"

type LeaderboardProps = {
  name: string;
  level: string;
  bestTime: number;
  date: string;
};

const formatTime = (ms: number): string => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const Leaderboard = () => {
  const [data, setData] = useState<LeaderboardProps[]>([]);
  const [dateFilter, setDateFilter] = useState("today");
  const [isLoading, setIsLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/leaderboard?date=${dateFilter}`);
        const json = await response.text();
        const parsedData = json ? JSON.parse(json) : [];
        setData(parsedData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [dateFilter]);

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const filteredData = data.filter(entry => {
    const matchesName = entry.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesDate = date ? entry.date.includes(format(date, "yyyy-MM-dd")) : true;
    return matchesName && matchesDate;
  });

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button
          onClick={() => setDateFilter("today")}
          variant={dateFilter === "today" ? "default" : "outline"}
        >
          Today
        </Button>
        <Button
          onClick={() => setDateFilter("all")}
          variant={dateFilter === "all" ? "default" : "outline"}
        >
          All Time
        </Button>
      </div>
      <div className="flex gap-4 mb-4">
        <Input 
          type="text"
          placeholder="Search by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="border p-2 rounded"
        />
        {dateFilter === "all" && (
          <Input 
            type="date"
            placeholder="Search by date"
            value={date ? format(date, "yyyy-MM-dd") : ""}
            onChange={(e) => {
              const selectedDate = new Date(e.target.value);
              if (!isNaN(selectedDate.getTime())) {
                setDate(selectedDate);
              } else {
                setDate(undefined); // Reset date if invalid
              }
            }}
            className="border p-2 rounded"
          />
        )}
         
      </div>
      <Table>
        <TableCaption>A list of top players.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Best Time</TableHead>
            <TableHead>Date & Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              </TableCell>
            </TableRow>
          ) : filteredData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          ) : (
                filteredData.map((entry, index) => (
                  <TableRow 
                    key={index} 
                    className="animate-fade-in"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>{capitalizeFirstLetter(entry.level)}</TableCell>
                    <TableCell>{formatTime(entry.bestTime)}</TableCell>
                    <TableCell>{formatDateTime(entry.date)}</TableCell>
                  </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
