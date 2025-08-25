import React from 'react';
import { PILLARS } from '@/data/osrl-framework';

interface RadarChartProps {
  data: Record<string, number>;
}

export function RadarChart({ data }: RadarChartProps) {
  const size = 300;
  const center = size / 2;
  const maxRadius = center - 40;
  const levels = 5;
  
  // Create points for each pillar
  const points = PILLARS.map((pillar, index) => {
    const angle = (index * 2 * Math.PI) / PILLARS.length - Math.PI / 2; // Start from top
    const value = data[pillar.id] || 0;
    const radius = (value / 100) * maxRadius;
    
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
      labelX: center + (maxRadius + 20) * Math.cos(angle),
      labelY: center + (maxRadius + 20) * Math.sin(angle),
      name: pillar.name,
      shortName: pillar.name.split(' ')[0] + (pillar.name.split(' ')[1] ? ` ${pillar.name.split(' ')[1]}` : ''),
      value: Math.round(value),
      angle
    };
  });

  // Create path for the data polygon
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z';

  // Create grid levels
  const gridLevels = Array.from({ length: levels }, (_, i) => {
    const radius = ((i + 1) / levels) * maxRadius;
    const levelPoints = PILLARS.map((_, index) => {
      const angle = (index * 2 * Math.PI) / PILLARS.length - Math.PI / 2;
      return {
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle)
      };
    });
    
    const levelPath = levelPoints.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';
    
    return { path: levelPath, value: ((i + 1) / levels) * 100 };
  });

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid lines from center to each axis */}
        {points.map((point, index) => (
          <line
            key={`axis-${index}`}
            x1={center}
            y1={center}
            x2={center + maxRadius * Math.cos(point.angle)}
            y2={center + maxRadius * Math.sin(point.angle)}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}
        
        {/* Grid levels */}
        {gridLevels.map((level, index) => (
          <g key={`level-${index}`}>
            <path
              d={level.path}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.2"
            />
            {/* Level labels */}
            <text
              x={center + ((index + 1) / levels) * maxRadius + 5}
              y={center - 5}
              fontSize="10"
              fill="hsl(var(--muted-foreground))"
              className="text-xs"
            >
              {Math.round(level.value)}%
            </text>
          </g>
        ))}
        
        {/* Data area */}
        <path
          d={pathData}
          fill="hsl(var(--primary))"
          fillOpacity="0.2"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="hsl(var(--primary))"
            stroke="white"
            strokeWidth="2"
          />
        ))}
        
        {/* Labels */}
        {points.map((point, index) => (
          <g key={`label-${index}`}>
            <text
              x={point.labelX}
              y={point.labelY - 8}
              textAnchor="middle"
              fontSize="11"
              fontWeight="500"
              fill="hsl(var(--foreground))"
              className="text-xs font-medium"
            >
              {point.shortName}
            </text>
            <text
              x={point.labelX}
              y={point.labelY + 6}
              textAnchor="middle"
              fontSize="10"
              fill="hsl(var(--primary))"
              fontWeight="600"
              className="text-xs"
            >
              {point.value}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}