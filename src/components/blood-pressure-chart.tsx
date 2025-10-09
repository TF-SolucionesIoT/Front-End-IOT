'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

type BloodPressureChartProps = {
  data: { date: string; systolic: number; diastolic: number }[];
};

const chartConfig = {
  systolic: {
    label: 'Systolic',
    color: 'hsl(var(--chart-2))',
  },
  diastolic: {
    label: 'Diastolic',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function BloodPressureChart({ data }: BloodPressureChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="systolic" fill="var(--color-systolic)" radius={4} />
        <Bar dataKey="diastolic" fill="var(--color-diastolic)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
