'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

type Spo2ChartProps = {
  data: { date: string; percentage: number }[];
};

const chartConfig = {
  percentage: {
    label: 'SpO2',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function Spo2Chart({ data }: Spo2ChartProps) {
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
          dataKey="percentage"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={3}
          domain={['dataMin - 2', 'dataMax + 1']}
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
          <linearGradient id="fillPercentage" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-percentage)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-percentage)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="percentage"
          type="natural"
          fill="url(#fillPercentage)"
          stroke="var(--color-percentage)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
