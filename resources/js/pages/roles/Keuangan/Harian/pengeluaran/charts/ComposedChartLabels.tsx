import React from 'react';
import { formatCurrency, formatCompact } from '../utils/formatters';
import { DESIRED_ORDER } from '../utils/constants';

export const CustomizedLabel = (props: any) => {
    const { x, y, stroke, value } = props;
    if (value === 0) return null;
    return (
        <text x={x} y={y} dy={-6} fill={stroke} fontSize={11} textAnchor="middle">
            {formatCompact(value)}
        </text>
    );
};

export const CustomTooltip = (props: any) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
        const uniquePayload = payload.reduce((acc: any[], current: any) => {
            if (!acc.some(item => item.dataKey === current.dataKey)) {
                acc.push(current);
            }
            return acc;
        }, []);

        return (
            <div className="bg-white/80 backdrop-blur-sm p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-bold text-gray-800">{`Periode: ${label}`}</p>
                <div className="mt-2 space-y-1">
                    {uniquePayload.sort((a: any, b: any) => DESIRED_ORDER.indexOf(a.dataKey) - DESIRED_ORDER.indexOf(b.dataKey)).map((p: any) => (
                        <div key={p.dataKey} className="flex justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
                                <span className="text-sm text-gray-700">{p.name}:</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{formatCurrency(p.value)}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};