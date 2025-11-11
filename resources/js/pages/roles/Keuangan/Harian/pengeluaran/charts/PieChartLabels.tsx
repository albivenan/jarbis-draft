
import React from 'react';
import { format } from 'date-fns';
import {
  JENIS_COLORS,
  jenisPengeluaranValues,
  DESIRED_LEGEND_ORDER,
  JenisPengeluaran,
} from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import { LegendPayload } from 'recharts';

interface PieChartDataEntry {
    name: string;
    value: number;
}

interface RenderCustomizedLabelWithLineProps {
    // Props injected by Recharts - make them optional for TypeScript
    cx?: number;
    cy?: number;
    outerRadius?: number;
    index?: number;
    percent?: number;
    midAngle?: number;
    paddingAngle?: number;

    // Custom prop that we provide - keep it required
    data: PieChartDataEntry[];
}

export const RenderCustomizedLabelWithLine = (props: RenderCustomizedLabelWithLineProps) => {
    const { cx, cy, outerRadius, index, data, paddingAngle } = props;

    // Type guard to ensure Recharts has injected the required props
    if (cx === undefined || cy === undefined || outerRadius === undefined || index === undefined || paddingAngle === undefined) {
        return null;
    }

    const RADIAN = Math.PI / 180;

    const totalValue = data.reduce((sum: number, entry: PieChartDataEntry) => sum + entry.value, 0);
    if (totalValue === 0) return null;

    const effectiveTotalAngle = 360 - data.length * paddingAngle;
    
    let accumulatedAngle = 0;
    const labelsInfo = data.map((entry: PieChartDataEntry, i: number) => {
        const percent = entry.value / totalValue;
        // Removed: if (percent < MIN_PERCENT_FOR_LABEL) return null;

        const sliceAngle = percent * effectiveTotalAngle;
        const midAngle = accumulatedAngle + sliceAngle / 2;
        
        accumulatedAngle += sliceAngle + paddingAngle;

        return {
            ...entry,
            midAngle,
            originalIndex: i,
            percent,
        };
    }); // Removed: .filter(Boolean);

    const currentLabelData = labelsInfo[index]; // Access directly by index as all are included
    if (!currentLabelData) return null; // Should not happen if data is valid

    const isRightSide = currentLabelData.midAngle < 90 || currentLabelData.midAngle > 270;
    
    const sideGroup = labelsInfo.filter((label: any) => {
        const onRight = label.midAngle < 90 || label.midAngle > 270;
        return onRight === isRightSide;
    }).sort((a: any, b: any) => {
        // Sort top-to-bottom on each side
        if (isRightSide) {
            if (a.midAngle > 90) a.midAngle -= 360; // Normalize angles for sorting (e.g., 350 becomes -10)
            if (b.midAngle > 90) b.midAngle -= 360;
        }
        return a.midAngle - b.midAngle;
    });

    const rankInSide = sideGroup.findIndex((l: any) => l.originalIndex === index);

    const chartHeight = cy * 2;
    const verticalMargin = 20;
    const availableHeight = chartHeight - (verticalMargin * 2);
    const slotHeight = sideGroup.length > 1 ? availableHeight / (sideGroup.length - 1) : availableHeight;
    const yPos = verticalMargin + (rankInSide * slotHeight);

    const lineAngleRad = currentLabelData.midAngle * RADIAN;
    const startRadius = outerRadius + 4;
    const sx = cx + startRadius * Math.cos(lineAngleRad);
    const sy = cy + startRadius * Math.sin(lineAngleRad);

    const bendRadius = outerRadius + 25;
    const bx = cx + bendRadius * (isRightSide ? 1 : -1);
    const by = yPos;

    const endLength = 30;
    const ex = bx + (isRightSide ? 1 : -1) * endLength;
    const ey = yPos;

    const textAnchor = isRightSide ? 'start' : 'end';
    const textX = ex + (isRightSide ? 5 : -5);
    const textY = ey;

    const color = JENIS_COLORS[jenisPengeluaranValues[index]];

    return (
        <g>
            <path d={`M${sx},${sy}L${bx},${by}L${ex},${ey}`} stroke={color} fill="none" strokeWidth={1} />
            <circle cx={sx} cy={sy} r={2} fill={color} stroke="none" />
            <text x={textX} y={textY} textAnchor={textAnchor} fill="#333" fontSize={12} dy={4}>
                {`${(currentLabelData.percent * 100).toFixed(0)}%`}
            </text>
        </g>
    );
};


export const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-2 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold">
          {`${payload[0].name}: ${formatCurrency(payload[0].value)}`}
        </p>
      </div>
    );
  }
  return null;
};

export const CustomPieChartLegend = ({ payload }: any) => {
  return (
    <ul className="recharts-default-legend" style={{ padding: 0, margin: 0 }}>
      {(payload ?? [])
        .sort((a: any, b: any) => {
          const orderA = DESIRED_LEGEND_ORDER.indexOf(a.value);
          const orderB = DESIRED_LEGEND_ORDER.indexOf(b.value);
          return orderA - orderB;
        })
        .map((entry: any, index: number) => {
          const fullJenisName = entry.value; // entry.value is already the full name
          const itemColor =
            (fullJenisName && JENIS_COLORS[fullJenisName as JenisPengeluaran]) ||
            entry.color;

          // No need for if (!fullJenisName) return null; as entry.value should always be present

          return (
            <li
              key={`item-${index}`}
              className="recharts-legend-item"
              style={{ display: 'block', marginBottom: '4px' }}
            >
              <svg
                className="recharts-surface"
                width="14"
                height="14"
                viewBox="0 0 32 32"
                style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  marginRight: '4px',
                }}
              >
                <path
                  stroke="none"
                  fill={itemColor}
                  d="M0,4h32v24h-32z"
                  className="recharts-legend-icon"
                />
              </svg>
              <span className="recharts-legend-item-text" style={{ color: '#333' }}>
                {fullJenisName}
              </span>
            </li>
          );
        })}
    </ul>
  );
};
