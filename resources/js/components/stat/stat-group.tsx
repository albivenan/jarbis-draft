import { StatCard, type StatCardProps } from '@/components/stat-card';

export function StatGroup({ items }: { items: (StatCardProps & { id: string | number })[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <StatCard key={item.id} {...item} />
      ))}
    </div>
  );
}

