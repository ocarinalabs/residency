"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "Visitor traffic over time";

interface ChartAreaInteractiveProps {
  chartData?: Array<{
    date: string;
    checkIns: number;
    checkOuts: number;
  }>;
}

const defaultChartData = [
  { date: "Mon", checkIns: 12, checkOuts: 8 },
  { date: "Tue", checkIns: 15, checkOuts: 12 },
  { date: "Wed", checkIns: 18, checkOuts: 15 },
  { date: "Thu", checkIns: 22, checkOuts: 18 },
  { date: "Fri", checkIns: 25, checkOuts: 20 },
  { date: "Sat", checkIns: 8, checkOuts: 6 },
  { date: "Sun", checkIns: 5, checkOuts: 4 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  checkIns: {
    label: "Check-ins",
    color: "hsl(var(--chart-1))",
  },
  checkOuts: {
    label: "Check-outs",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({ chartData }: ChartAreaInteractiveProps) {
  const data = chartData || defaultChartData;
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("7d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Visitor Traffic</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Showing visitor check-ins and check-outs
          </span>
          <span className="@[540px]/card:hidden">Visitor traffic</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="7d">This Week</ToggleGroupItem>
            <ToggleGroupItem value="30d">This Month</ToggleGroupItem>
            <ToggleGroupItem value="90d">Last 3 Months</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg @[767px]/card:hidden"
              aria-label="Select a value"
            >
              <SelectValue placeholder="This week" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                This Week
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                This Month
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                Last 3 Months
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillCheckIns" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-checkIns)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-checkIns)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCheckOuts" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-checkOuts)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-checkOuts)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="checkIns"
              type="natural"
              fill="url(#fillCheckIns)"
              stroke="var(--color-checkIns)"
              stackId="a"
            />
            <Area
              dataKey="checkOuts"
              type="natural"
              fill="url(#fillCheckOuts)"
              stroke="var(--color-checkOuts)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
