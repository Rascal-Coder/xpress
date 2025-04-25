import type { TooltipProps } from 'recharts';
import type {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface GrowthAreaChartProps {
  data: Array<{
    [key: string]: number | string;
    name: string;
  }>;
  dataKey: string;
  label: string;
  prefix?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  prefix,
}: { prefix?: string } & TooltipProps<ValueType, NameType>) => {
  if (active && payload?.[0]?.value) {
    return (
      <div className="border-border bg-card rounded-lg border p-3 shadow-sm">
        <p className="text-foreground text-sm">{label}</p>
        <p className="text-sm font-medium">
          {payload[0].name}: {prefix}
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function GrowthAreaChart({
  data,
  dataKey,
  label,
  prefix,
}: GrowthAreaChartProps) {
  const gradientId = `color${dataKey}`;

  return (
    <div className="h-[300px]">
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid className="stroke-muted" strokeDasharray="3 3" />
          <XAxis
            axisLine={false}
            dataKey="name"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) =>
              `${prefix || ''}${value.toLocaleString()}`
            }
            tickLine={false}
          />
          <Tooltip
            content={(props) => <CustomTooltip {...props} prefix={prefix} />}
          />
          <Area
            dataKey={dataKey}
            fill={`url(#${gradientId})`}
            name={label}
            stroke="hsl(var(--primary))"
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
