import { Card } from '@xpress-core/shadcn-ui';

import { type ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  change?: {
    type: 'decrease' | 'increase';
    value: string;
  };
  children?: ReactNode;
}

export function StatCard({ title, value, change, children }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="muted-foreground text-sm font-medium">{title}</h3>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        {change && (
          <span
            className={`rounded px-2 py-1 text-xs ${
              change.type === 'increase'
                ? 'bg-emerald-500/20 text-emerald-500 dark:bg-emerald-500/10'
                : 'bg-red-500/20 text-red-500 dark:bg-red-500/10'
            }`}
          >
            {change.value}
          </span>
        )}
      </div>
      {children}
    </Card>
  );
}
