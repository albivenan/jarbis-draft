import { cn } from '@/lib/utils';

export function StatDelta({ value, positive = true, className }: { value: string; positive?: boolean; className?: string }) {
  return (
    <span className={cn('text-xs font-medium', positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400', className)}>
      {positive ? '▲' : '▼'} {value}
    </span>
  );
}

