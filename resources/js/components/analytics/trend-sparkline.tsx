import { cn } from '@/lib/utils';

export interface TrendSparklineProps {
  points: number[];
  width?: number;
  height?: number;
  stroke?: string;
  className?: string;
}

export function TrendSparkline({ points, width = 120, height = 36, stroke = 'currentColor', className }: TrendSparklineProps) {
  if (!points.length) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const norm = (v: number) => (max === min ? height / 2 : ((v - min) / (max - min)) * (height - 4) + 2);
  const stepX = width / (points.length - 1);
  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * stepX} ${height - norm(p)}`)
    .join(' ');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className={cn('opacity-80', className)}>
      <path d={d} fill="none" stroke={stroke} strokeWidth={2} />
    </svg>
  );
}

