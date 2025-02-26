"use client";

import * as React from "react";
import {
  LucideComputer,
  LucideMoon,
  LucidePalette,
  LucideSun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";

const ColorThemes = [
  { name: "Red", value: "red", tailwindColor: "bg-red-500" },
  { name: "Orange", value: "orange", tailwindColor: "bg-orange-500" },
  { name: "Yellow", value: "yellow", tailwindColor: "bg-yellow-500" },
  { name: "Green", value: "green", tailwindColor: "bg-green-500" },
  { name: "Blue", value: "blue", tailwindColor: "bg-blue-500" },
  { name: "Violet", value: "violet", tailwindColor: "bg-violet-500" },
  { name: "Zinc", value: "zinc", tailwindColor: "bg-zinc-500" },
];

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  // Set initial state to a fallback theme (zinc) until localStorage is available
  const [colorSet, setColor] = React.useState<string>("zinc");

  React.useEffect(() => {
    // Check if we are on the client side and localStorage is available
    if (typeof window !== "undefined") {
      const savedColor = localStorage.getItem("themeColor");
      if (savedColor) {
        setColor(savedColor); // Get saved color theme
      }
    }
  }, []);

  // Function to change the color theme
  const changeTheme = (newColor: string) => {
    // Remove previous theme
    document.documentElement.classList.remove(`theme-${colorSet}`);

    // Add new theme
    document.documentElement.classList.add(`theme-${newColor}`);

    // Store in localStorage
    localStorage.setItem("themeColor", newColor);

    setColor(newColor);
  };

  // Effect to apply theme on mount
  React.useEffect(() => {
    if (colorSet) {
      document.documentElement.classList.add(`theme-${colorSet}`);
    }
  }, [colorSet]);

  return (
    <Popover>
      <PopoverTrigger>
        <LucidePalette />
      </PopoverTrigger>
      <PopoverContent className="w-[280px] sm:w-[400px] shadow-md dark:shadow-neutral-900 origin-top-right animate-in zoom-in-90 duration-200">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="py-2 font-semibold">Color</div>
          <div className="flex gap-2 flex-wrap">
            {ColorThemes.map((color) => (
              <Button
                key={color.value}
                variant="outline"
                className={`rounded-md ${
                  colorSet === color.value
                    ? "border-2 border-black dark:border-white"
                    : ""
                }`}
                onClick={() => changeTheme(color.value)}
              >
                <div className={`h-3 w-3 sm:h-4 sm:w-4 ${color.tailwindColor} rounded-full`} />
                {color.name}
              </Button>
            ))}
          </div>

          <div className="py-2 font-semibold">Mode</div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              className={`rounded-md ${
                theme === "light" ? "border-2 border-black" : ""
              }`}
              onClick={() => setTheme("light")}
            >
              <LucideSun /> Light
            </Button>

            <Button
              variant="outline"
              className={`rounded-md ${
                theme === "dark" ? "border-2 border-white" : ""
              }`}
              onClick={() => setTheme("dark")}
            >
              <LucideMoon /> Dark
            </Button>

            <Button
              variant="outline"
              className={`rounded-md ${
                theme === "system"
                  ? "border-2 border-black dark:border-white"
                  : ""
              }`}
              onClick={() => setTheme("system")}
            >
              <LucideComputer /> System
            </Button>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
