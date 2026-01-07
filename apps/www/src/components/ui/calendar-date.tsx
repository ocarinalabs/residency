"use client";

import { Button } from "@residence/ui/components/shadcn/button";
import { Calendar } from "@residence/ui/components/shadcn/calendar";
import { Input } from "@residence/ui/components/shadcn/input";
import { Label } from "@residence/ui/components/shadcn/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@residence/ui/components/shadcn/popover";
import { addDays } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

const TIME = {
  DEFAULT_START: "09:00",
  DEFAULT_END: "23:59",
  THURSDAY: 4,
  DAYS_IN_WEEK: 7,
} as const;

const DATE_PRESETS = {
  TODAY: 0,
  TOMORROW: 1,
} as const;

type Calendar24Props = {
  onDateTimeChange?: (date: string, time: string) => void;
};

export function Calendar24({ onDateTimeChange }: Calendar24Props) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<string>(TIME.DEFAULT_START);
  const [endTime] = useState<string>(TIME.DEFAULT_END);

  const getNextThursday = (): number => {
    const today = new Date();
    const currentDay = today.getDay();

    if (currentDay === TIME.THURSDAY) {
      return DATE_PRESETS.TODAY;
    }

    let daysUntilThursday = TIME.THURSDAY - currentDay;

    if (daysUntilThursday < 0) {
      daysUntilThursday += TIME.DAYS_IN_WEEK;
    }

    return daysUntilThursday;
  };

  const isDateSelected = (presetDays: number): boolean => {
    if (!date) {
      return false;
    }
    const presetDate = addDays(new Date(), presetDays);
    return (
      date.getFullYear() === presetDate.getFullYear() &&
      date.getMonth() === presetDate.getMonth() &&
      date.getDate() === presetDate.getDate()
    );
  };

  useEffect(() => {
    const today = new Date();
    setDate(today);
    if (onDateTimeChange) {
      onDateTimeChange(today.toISOString().split("T")[0] ?? "", startTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDateTimeChange, startTime]);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate && onDateTimeChange) {
      onDateTimeChange(newDate.toISOString().split("T")[0] ?? "", startTime);
    }
  };

  const handleTimeChange = (newTime: string) => {
    setStartTime(newTime);
    if (date && onDateTimeChange) {
      onDateTimeChange(date.toISOString().split("T")[0] ?? "", newTime);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label className="px-1" htmlFor="date">
          Date<span className="align-top text-red-500 text-xs">*</span>
        </Label>
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger asChild>
            <Button
              className="w-full justify-between font-normal"
              id="date"
              variant="outline"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto overflow-hidden p-0">
            <Calendar
              captionLayout="dropdown"
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
              mode="single"
              onSelect={(newDate) => {
                handleDateChange(newDate);
                setOpen(false);
              }}
              selected={date}
            />
          </PopoverContent>
        </Popover>
        <div className="flex gap-2">
          {[
            { label: "today", value: DATE_PRESETS.TODAY },
            { label: "tomorrow", value: DATE_PRESETS.TOMORROW },
            { label: "demo day", value: getNextThursday() },
          ].map((preset) => (
            <Button
              className="flex-1 font-mono"
              key={preset.label}
              onClick={() => {
                const newDate = addDays(new Date(), preset.value);
                handleDateChange(newDate);
              }}
              size="sm"
              type="button"
              variant={isDateSelected(preset.value) ? "default" : "outline"}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <Label className="px-1" htmlFor="time-from">
            From
          </Label>
          <Input
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            id="time-from"
            onChange={(e) => handleTimeChange(e.target.value)}
            type="time"
            value={startTime}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="px-1" htmlFor="time-to">
            To
          </Label>
          <Input
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            disabled={true}
            id="time-to"
            type="time"
            value={endTime}
          />
        </div>
      </div>
    </div>
  );
}
