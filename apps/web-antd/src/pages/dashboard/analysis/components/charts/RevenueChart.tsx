import type { TooltipProps } from 'recharts';
import type {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface RevenueChartProps {
  data: Array<{
    name: string;
    revenue: number;
  }>;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload?.[0]?.value) {
    return (
      <div className="border-border bg-card rounded-lg border p-3 shadow-sm">
        <p className="text-foreground text-sm">{label}</p>
        <p className="text-sm font-medium">
          收入: ¥{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-[200px]">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={data}>
          <Bar
            dataKey="revenue"
            fill="hsl(var(--primary))"
            name="收入"
            radius={[4, 4, 0, 0]}
          />
          <XAxis
            axisLine={false}
            dataKey="name"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `¥${value.toLocaleString()}`}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
