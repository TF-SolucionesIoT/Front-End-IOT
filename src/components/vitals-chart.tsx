'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

type VitalsChartProps = {
  data: any[];
  dataKey: string;
  color: string;
  chartType: 'area' | 'bar';
};

export function VitalsChart({
  data,
  dataKey,
  color,
  chartType,
}: VitalsChartProps) {
  const chartConfig = {
    [dataKey]: {
      label: dataKey,
      color: `hsl(${color})`,
    },
  } satisfies ChartConfig;

  const ChartComponent = chartType === 'area' ? AreaChart : BarChart;
  const ChartPrimitive = chartType === 'area' ? Area : Bar;

  return (
    <ChartContainer config={chartConfig} className="h-[50px] w-full">
      <ChartComponent
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
        <ChartPrimitive
          dataKey={dataKey}
          type="natural"
          fill={
            chartType === 'area' ? `url(#fill-${dataKey})` : `hsl(${color})`
          }
          stroke={`hsl(${color})`}
          stackId="a"
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel hideIndicator />}
        />
      </ChartComponent>
    </ChartContainer>
  );
}
