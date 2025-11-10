"use client";
// import "@/styles/calendar.css";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Calendar23() {
  const [range, setRange] = React.useState<DateRange | undefined>(undefined);

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="dates" className="px-1">
        Date Range
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dates"
            className="w-[inherit] justify-between font-normal"
          >
            {range?.from && range?.to
              ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
              : "Select date range"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <Calendar
            mode="range"
            selected={range}
            captionLayout="dropdown"
            onSelect={(range) => {
              setRange(range);
            }}
            // className="p-2 [--cell-size:1rem]"
            // classNames={{
            //   day: "h-11 w-11 p-0 font-normal rounded-md transition-colors hover:bg-indigo-100 hover:text-indigo-600",
            //   day_selected: "bg-indigo-600 text-white hover:bg-indigo-700",
            //   day_today: "font-bold border border-indigo-500",
            //   day_range_middle: "bg-indigo-200 text-black",
            //   head_cell: "text-gray-500 font-medium",
            //   caption_label: "font-semibold",
            // }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
