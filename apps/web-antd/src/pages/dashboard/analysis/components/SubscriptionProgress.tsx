interface SubscriptionData {
  type: string;
  value: number;
  color: string;
}

interface SubscriptionProgressProps {
  data: SubscriptionData[];
}

export function SubscriptionProgress({ data }: SubscriptionProgressProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div className="space-y-2" key={item.type}>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.type}</span>
            <span className="font-medium">{item.value}</span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(item.value / total) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
