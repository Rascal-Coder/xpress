import type { TooltipProps } from 'recharts';
import type {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface SubscribersChartProps {
  data: Array<{
    name: string;
    projected: number;
    subscribers: number;
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
        {payload.map((entry) => (
          <p className="text-sm font-medium" key={entry.name}>
            {entry.name}
            {entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function SubscribersChart({ data }: SubscribersChartProps) {
  return (
    <div className="h-[200px]">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data}>
          <Line
            dataKey="subscribers"
            dot={false}
            name="实际用户"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            type="monotone"
          />
          <Line
            dataKey="projected"
            dot={false}
            name="预计用户"
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="5 5"
            strokeWidth={2}
            type="monotone"
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
            tickFormatter={(value) => value.toLocaleString()}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
