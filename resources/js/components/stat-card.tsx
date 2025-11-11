import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  hint?: string;
  rightSlot?: ReactNode;
  className?: string;
}

export function StatCard({ title, value, hint, rightSlot, className }: StatCardProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {hint && <CardDescription className="mt-1">{hint}</CardDescription>}
        </div>
        {rightSlot}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
}

