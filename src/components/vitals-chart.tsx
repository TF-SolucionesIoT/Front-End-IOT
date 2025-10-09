"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

type VitalsChartProps = {
  data: { month: string; value: number }[];
  dataKey: string;
  color: string;
};

export function VitalsChart({ data, dataKey, color }: VitalsChartProps) {
  const chartConfig = {
    [dataKey]: {
      label: dataKey,
      color: `hsl(${color})`,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-[50px] w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 0,
          right: 0,
          top: 5,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={`hsl(${color})`}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor={`hsl(${color})`}
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="natural"
          fill={`url(#fill-${dataKey})`}
          stroke={`hsl(${color})`}
          stackId="a"
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel hideIndicator />}
        />
      </AreaChart>
    </ChartContainer>
  );
}
