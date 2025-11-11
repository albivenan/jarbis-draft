import { cn } from '@/lib/utils';

type LineChartProps = {
  labels: string[];
  values: number[];
  width?: number;
  height?: number;
  padding?: { top: number; right: number; bottom: number; left: number };
  color?: string;
  showPoints?: boolean;
  className?: string;
};

export function LineChart({
  labels,
  values,
  width = 560,
  height = 220,
  padding = { top: 16, right: 16, bottom: 28, left: 36 },
  color = 'currentColor',
  showPoints = true,
  className,
}: LineChartProps) {
  if (!labels.length || labels.length !== values.length) return null;

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const yMin = Math.floor(Math.min(100, Math.max(0, min - 5)));
  const yMax = Math.ceil(Math.min(100, Math.max(0, max + 5)));

  const xStep = innerWidth / (values.length - 1 || 1);
  const yScale = (v: number) => {
    const t = (v - yMin) / (yMax - yMin || 1);
    return padding.top + innerHeight - t * innerHeight;
  };

  const d = values
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${padding.left + i * xStep} ${yScale(v)}`)
    .join(' ');

  const gridLines = 4;
  const grid = Array.from({ length: gridLines + 1 }, (_, i) => {
    const y = padding.top + (innerHeight / gridLines) * i;
    const value = Math.round(yMax - ((yMax - yMin) / gridLines) * i);
    return { y, value };
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={cn('text-primary/80', className)}>
      {/* grid */}
      {grid.map((g, idx) => (
        <g key={idx}>
          <line x1={padding.left} x2={width - padding.right} y1={g.y} y2={g.y} stroke="currentColor" opacity={0.1} />
          <text x={padding.left - 8} y={g.y + 4} fontSize={10} textAnchor="end" fill="currentColor" opacity={0.6}>
            {g.value}
          </text>
        </g>
      ))}
      {/* x labels */}
      {labels.map((lb, i) => (
        <text key={i} x={padding.left + i * xStep} y={height - 8} fontSize={10} textAnchor="middle" fill="currentColor" opacity={0.6}>
          {lb.slice(0, 3)}
        </text>
      ))}
      {/* line */}
      <path d={d} fill="none" stroke={color} strokeWidth={2} />
      {/* points */}
      {showPoints &&
        values.map((v, i) => (
          <circle key={i} cx={padding.left + i * xStep} cy={yScale(v)} r={3} fill={color} />
        ))}
    </svg>
  );
}





