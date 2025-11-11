import { cn } from '@/lib/utils';

type DonutChartProps = {
  values: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  className?: string;
};

export function DonutChart({ values, size = 120, thickness = 14, className }: DonutChartProps) {
  const total = values.reduce((s, v) => s + v.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={cn(className)}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        {values.map((seg, idx) => {
          const frac = seg.value / total;
          const length = frac * circumference;
          const circle = (
            <circle
              key={idx}
              r={radius}
              cx={0}
              cy={0}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
            />
          );
          offset += length;
          return circle;
        })}
      </g>
    </svg>
  );
}





