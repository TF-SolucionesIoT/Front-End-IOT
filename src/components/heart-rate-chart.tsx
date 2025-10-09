'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

type HeartRateChartProps = {
  data: { date: string; bpm: number }[];
};

const chartConfig = {
  bpm: {
    label: 'Heart Rate',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function HeartRateChart({ data }: HeartRateChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <YAxis
          dataKey="bpm"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={4}
        />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillBpm" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-bpm)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-bpm)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="bpm"
          type="natural"
          fill="url(#fillBpm)"
          stroke="var(--color-bpm)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
