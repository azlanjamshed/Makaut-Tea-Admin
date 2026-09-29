import React, { useState } from 'react';
import Card from '../common/Card';
import { TrendingUp } from 'lucide-react';

const CHART_DATA = {
  today: {
    labels: ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', 'Now'],
    rants: [4, 1, 3, 12, 28, 45, 62, 38, 24],
    users: [8, 3, 5, 20, 52, 78, 110, 85, 42],
  },
  '7d': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    rants: [120, 185, 140, 210, 290, 230, 310],
    users: [320, 410, 380, 520, 680, 590, 740],
  },
  '30d': {
    labels: ['W1', 'W2', 'W3', 'W4'],
    rants: [820, 1140, 1380, 1690],
    users: [2100, 2800, 3400, 4200],
  },
};

const ActivityChart = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const data = CHART_DATA[timeframe] || CHART_DATA['7d'];
  const maxVal = Math.max(...data.rants, ...data.users) * 1.15 || 100;

  // Chart dimensions
  const width = 600;
  const height = 200;
  const paddingX = 40;
  const paddingY = 25;

  const getPoints = (values) => {
    return values.map((val, idx) => {
      const x = paddingX + (idx / (values.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - (val / maxVal) * (height - paddingY * 2);
      return { x, y, val };
    });
  };

  const rantsPoints = getPoints(data.rants);
  const usersPoints = getPoints(data.users);

  const generateSvgPath = (points) => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      d += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  };

  const generateAreaPath = (points) => {
    const linePath = generateSvgPath(points);
    if (!linePath) return '';
    const last = points[points.length - 1];
    const first = points[0];
    return `${linePath} L ${last.x} ${height - paddingY} L ${first.x} ${height - paddingY} Z`;
  };

  return (
    <Card className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              Platform Activity & Velocity
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Compare rant volume against student user interactions
          </p>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-[var(--border-color)] self-stretch sm:self-auto">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => {
                setTimeframe(tf.id);
                setHoveredIdx(null);
              }}
              className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                timeframe === tf.id
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs text-slate-500 pt-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-[var(--color-primary)] shadow-xs" />
          <span className="font-medium text-slate-700">Active Students</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-purple-500 shadow-xs" />
          <span className="font-medium text-slate-700">Rants Posted</span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden pt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-56 overflow-visible"
        >
          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, i) => {
            const y = paddingY + ratio * (height - paddingY * 2);
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#E5E7EB"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* User Activity Area & Line */}
          <path d={generateAreaPath(usersPoints)} fill="#4F3DE6" fillOpacity="0.10" />
          <path
            d={generateSvgPath(usersPoints)}
            fill="none"
            stroke="#4F3DE6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Rant Posts Area & Line */}
          <path d={generateAreaPath(rantsPoints)} fill="#A855F7" fillOpacity="0.10" />
          <path
            d={generateSvgPath(rantsPoints)}
            fill="none"
            stroke="#A855F7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Interactive nodes */}
          {usersPoints.map((pt, idx) => (
            <g
              key={idx}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === idx ? 6 : 4}
                className="fill-[var(--color-primary)] stroke-white stroke-2 transition-all"
              />
              <circle
                cx={rantsPoints[idx].x}
                cy={rantsPoints[idx].y}
                r={hoveredIdx === idx ? 6 : 4}
                className="fill-purple-500 stroke-white stroke-2 transition-all"
              />
              {/* X Axis Label */}
              <text
                x={pt.x}
                y={height - 5}
                textAnchor="middle"
                className="text-[10px] fill-slate-500 font-mono"
              >
                {data.labels[idx]}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredIdx !== null && (
          <div className="p-2.5 rounded-xl bg-white border border-[var(--border-color)] shadow-md flex items-center justify-between text-xs mt-2 animate-in fade-in">
            <span className="text-slate-500 font-mono">
              Period: <strong className="text-slate-900">{data.labels[hoveredIdx]}</strong>
            </span>
            <div className="flex items-center gap-4">
              <span className="text-[var(--color-primary)] font-bold">
                Students: {data.users[hoveredIdx]}
              </span>
              <span className="text-purple-600 font-bold">
                Rants: {data.rants[hoveredIdx]}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ActivityChart;
