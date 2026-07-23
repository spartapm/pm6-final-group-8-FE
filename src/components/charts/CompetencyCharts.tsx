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

const PRIMARY = '#EC6C6C';
const MUTED = '#1a1a1a';

export function CompetencyRadarChart({ data }: RadarChartProps) {
  const chartData = data.map((d) => ({ subject: d.label, count: d.count }));
  const maxCount = Math.max(...data.map((d) => d.count), 0);
  const topLabels = new Set(
    data.filter((d) => d.count > 0 && d.count === maxCount).map((d) => d.label),
  );

  return (
    <div className="pointer-events-none select-none">
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#e8e8e8" />
          <PolarAngleAxis
            dataKey="subject"
            tick={(props) => {
              const { x, y, payload, textAnchor } = props as {
                x: number;
                y: number;
                textAnchor?: 'start' | 'middle' | 'end' | 'inherit';
                payload: { value: string };
              };
              const isTop = topLabels.has(payload.value);
              return (
                <text
                  x={x}
                  y={y}
                  textAnchor={textAnchor ?? 'middle'}
                  dominantBaseline="central"
                  fill={isTop ? PRIMARY : MUTED}
                  fontSize={isTop ? 12 : 11}
                  fontWeight={isTop ? 700 : 500}
                >
                  {payload.value}
                </text>
              );
            }}
          />
          <Radar
            name="역량"
            dataKey="count"
            stroke={PRIMARY}
            fill={PRIMARY}
            fillOpacity={0.3}
            isAnimationActive={false}
            activeDot={false}
            dot={{ r: 4, fill: PRIMARY, stroke: PRIMARY }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface BarChartProps {
  data: Array<{ name: string; count: number }>;
}

export function CompetencyBarChart({ data }: BarChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const topCode = Math.max(...data.map((d) => d.count), 0);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data.slice(0, 8)} layout="vertical" margin={{ left: 0, right: 16 }}>
        <XAxis type="number" hide domain={[0, maxCount]} />
        <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.slice(0, 8).map((entry) => (
            <Cell
              key={entry.name}
              fill={entry.count === topCode && topCode > 0 ? PRIMARY : '#F5B4B4'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
