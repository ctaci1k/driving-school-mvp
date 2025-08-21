// components/reports/SimpleChart.tsx

interface SimpleChartProps {
  data: { label: string; value: number }[]
  height?: number
  color?: string
}

export function SimpleChart({ data, height = 200, color = '#3B82F6' }: SimpleChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end justify-between h-full gap-2">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100
          return (
            <div key={index} className="flex-1 flex flex-col items-center justify-end">
              <span className="text-xs font-medium mb-1">{item.value}</span>
              <div 
                className="w-full rounded-t transition-all hover:opacity-80"
                style={{ 
                  height: `${percentage}%`,
                  backgroundColor: color,
                  minHeight: '4px'
                }}
              />
              <span className="text-xs text-gray-600 mt-1">{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}