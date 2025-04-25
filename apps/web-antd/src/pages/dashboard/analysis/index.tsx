import { Card } from '@xpress-core/shadcn-ui';

import { GrowthAreaChart } from './components/charts/GrowthAreaChart';
import { RevenueChart } from './components/charts/RevenueChart';
import { SubscribersChart } from './components/charts/SubscribersChart';
import { StatCard } from './components/StatCard';
import { SubscriptionProgress } from './components/SubscriptionProgress';

const monthlyData = Array.from({ length: 12 }, (_, i) => ({
  name: `${i + 1}月`,
  revenue: Math.floor(Math.random() * 1000 + 500),
  subscribers: Math.floor(Math.random() * 500 + 100),
  projected: Math.floor(Math.random() * 1200 + 600),
}));

const subscriptionData = [
  { type: '个人用户', value: 4279, color: 'hsl(346, 87%, 65%)' },
  { type: '团队用户', value: 4827, color: 'hsl(var(--primary))' },
  { type: '企业用户', value: 3556, color: 'hsl(142, 76%, 36%)' },
];

export default function Analysis() {
  return (
    <div className="space-y-6 p-6">
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          change={{ type: 'increase', value: '+8.1%' }}
          title="月度收入"
          value="¥1,439,346"
        >
          <RevenueChart data={monthlyData} />
        </StatCard>

        <StatCard
          change={{ type: 'increase', value: '+4.7%' }}
          title="活跃用户"
          value="142,869"
        >
          <SubscribersChart data={monthlyData} />
        </StatCard>

        <StatCard
          change={{ type: 'increase', value: '+4.4%' }}
          title="新增订阅"
          value="26,864"
        >
          <SubscriptionProgress data={subscriptionData} />
        </StatCard>
      </div>

      {/* 底部图表 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-6 text-lg font-semibold">收入增长</h3>
          <GrowthAreaChart
            data={monthlyData}
            dataKey="revenue"
            label="月度收入"
            prefix="¥"
          />
        </Card>

        <Card className="p-6">
          <h3 className="mb-6 text-lg font-semibold">用户增长</h3>
          <GrowthAreaChart
            data={monthlyData}
            dataKey="subscribers"
            label="活跃用户"
          />
        </Card>
      </div>
    </div>
  );
}
