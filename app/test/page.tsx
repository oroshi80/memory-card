import React from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

  const countries = [
    {
      name: "United Kingdom",
      code: "gb",
    },
    {
      name: "United States",
      code: "us",
    },
    {
      name: "Canada",
      code: "ca",
    },
    {
      name: "Mexico",
      code: "mx",
    },
  ];

export default function Test() {
  return (
      <div className="flex items-center justify-center h-screen">
          <div className="w-1/2">
          
          <Select> 
        <SelectTrigger>
          <SelectValue placeholder="Select your country" />
        </SelectTrigger>
        <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                          
                        <div className="flex items-center gap-2">
                            <Avatar className="w-4 h-4">
                                <AvatarImage src={`https://flagcdn.com/w40/${country.code}.png`}  />
                                <AvatarFallback>{country.code}</AvatarFallback>
                            </Avatar> {country.name}
                        </div>
                    </SelectItem>
                  ))}
        </SelectContent>
      </Select>
          </div>
    </div>
  );
}
