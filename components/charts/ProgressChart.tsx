// components/charts/ProgressChart.tsx

'use client';

interface ProgressChartProps {
  period: string;
}

export default function ProgressChart({ period }: ProgressChartProps) {
  // Mock data based on period
  const getData = () => {
    const labels = period === 'month' 
      ? ['Tydzień 1', 'Tydzień 2', 'Tydzień 3', 'Tydzień 4']
      : ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze'];
    
    const values = period === 'month'
      ? [45, 55, 60, 65]
      : [20, 35, 45, 55, 60, 65];
      
    return { labels, values };
  };

  const { labels, values } = getData();
  const maxValue = Math.max(...values);
  const chartHeight = 150;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">Postęp w czasie</h3>
        <span className="text-xs text-gray-500">
          {period === 'month' ? 'Ostatni miesiąc' : 'Ostatnie 6 miesięcy'}
        </span>
      </div>
      
      <div className="flex-1 flex items-end justify-between gap-2 min-h-[150px]">
        {values.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col items-center justify-end" style={{ height: `${chartHeight}px` }}>
              <span className="text-xs font-medium text-gray-700 mb-1">{value}%</span>
              <div 
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                style={{ 
                  height: `${(value / maxValue) * 100}%`,
                  minHeight: '4px'
                }}
              />
            </div>
            <span className="text-xs text-gray-500 mt-2">{labels[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}