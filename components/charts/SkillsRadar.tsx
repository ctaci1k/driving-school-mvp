// components/charts/SkillsRadar.tsx

'use client';

interface Skill {
  name: string;
  score: number;
  category: string;
}

interface SkillsRadarProps {
  skills: Skill[];
}

export default function SkillsRadar({ skills }: SkillsRadarProps) {
  // Group skills by category and calculate average
  const categories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = { total: 0, count: 0, skills: [] };
    }
    acc[skill.category].total += skill.score;
    acc[skill.category].count += 1;
    acc[skill.category].skills.push(skill);
    return acc;
  }, {} as Record<string, { total: number; count: number; skills: Skill[] }>);

  const categoryData = Object.entries(categories).map(([category, data]) => ({
    category,
    average: Math.round(data.total / data.count),
    skills: data.skills
  }));

  // Simple visualization - could be replaced with a real chart library
  const centerX = 120;
  const centerY = 120;
  const radius = 80;
  const angleStep = (2 * Math.PI) / categoryData.length;

  return (
    <div className="w-full">
      <svg viewBox="0 0 240 240" className="w-full h-auto" style={{ maxHeight: '240px' }}>
        {/* Background circles */}
        {[20, 40, 60, 80, 100].map((r) => (
          <circle
            key={r}
            cx={centerX}
            cy={centerY}
            r={(radius * r) / 100}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* Axes */}
        {categoryData.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return (
            <line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Data polygon */}
        <polygon
          points={categoryData.map((data, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const r = (radius * data.average) / 100;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            return `${x},${y}`;
          }).join(' ')}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {categoryData.map((data, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const r = (radius * data.average) / 100;
          const x = centerX + r * Math.cos(angle);
          const y = centerY + r * Math.sin(angle);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="rgb(59, 130, 246)"
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
        
        {/* Labels */}
        {categoryData.map((data, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const labelRadius = radius + 20;
          const x = centerX + labelRadius * Math.cos(angle);
          const y = centerY + labelRadius * Math.sin(angle);
          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-gray-600 font-medium"
            >
              {data.category}
            </text>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {categoryData.map((data) => (
          <div key={data.category} className="flex items-center justify-between">
            <span className="text-gray-600">{data.category}:</span>
            <span className="font-medium text-gray-900">{data.average}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}