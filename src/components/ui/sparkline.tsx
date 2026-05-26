import * as React from 'react';

interface SparklineProps {
  points: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({
  points,
  color = '#22D3EE',
  width = 80,
  height = 32,
  className,
}: SparklineProps) {
  if (!points || points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const padX = 2;
  const padY = 2;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const coords = points.map((v, i) => ({
    x: padX + (i / (points.length - 1)) * innerW,
    y: padY + innerH - ((v - min) / range) * innerH,
  }));

  const linePath = coords
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ');

  const areaPath = [
    linePath,
    `L${coords[coords.length - 1].x.toFixed(2)},${(padY + innerH).toFixed(2)}`,
    `L${padX},${(padY + innerH).toFixed(2)}`,
    'Z',
  ].join(' ');

  const gradId = `spark-${color.replace('#', '')}-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.30" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
