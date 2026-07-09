'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface RadarChartProps {
  data: Array<{ label: string; count: number }>;
}

export function CompetencyRadarChart({ data }: RadarChartProps) {
  const chartData = data.map((d) => ({ subject: d.label, count: d.count }));
  const topCount = Math.max(...data.map((d) => d.count), 0);
  const topLabel = data.find((d) => d.count === topCount && topCount > 0)?.label;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart data={chartData}>
        <PolarGrid stroke="#e8e8e8" />
        <PolarAngleAxis
          dataKey="subject"
          tick={({ x, y, payload }) => {
            const isTop = payload.value === topLabel;
            return (
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isTop ? '#EC6C6C' : '#1a1a1a'}
                fontSize={isTop ? 13 : 11}
                fontWeight={isTop ? 700 : 400}
              >
                {payload.value}
              </text>
            );
          }}
        />
        <Radar
          name="역량"
          dataKey="count"
          stroke="#EC6C6C"
          fill="#EC6C6C"
          fillOpacity={0.3}
          dot={{ r: 4, fill: '#EC6C6C', stroke: '#EC6C6C', strokeWidth: 1 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

interface BarChartProps {
  data: Array<{ name: string; count: number }>;
}

export function CompetencyBarChart({ data }: BarChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const topCode = data[0]?.count ?? 0;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data.slice(0, 8)} layout="vertical" margin={{ left: 0, right: 16 }}>
        <XAxis type="number" hide domain={[0, maxCount]} />
        <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.slice(0, 8).map((entry) => (
            <Cell
              key={entry.name}
              fill={entry.count === topCode && topCode > 0 ? '#EC6C6C' : '#F5B4B4'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
