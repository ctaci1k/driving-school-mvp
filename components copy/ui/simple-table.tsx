// components/ui/simple-table.tsx

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
}

interface SimpleTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (item: T) => void
}

export function SimpleTable<T extends Record<string, any>>({ 
  data, 
  columns,
  onRowClick 
}: SimpleTableProps<T>) {
  const t = useTranslations()
  
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('messages.noData')}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            {columns.map((column) => (
              <th 
                key={column.key}
                className="text-left p-3 font-medium text-gray-700"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr 
              key={index}
              className={cn(
                "border-b hover:bg-gray-50 transition-colors",
                onRowClick && "cursor-pointer"
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td key={column.key} className="p-3">
                  {column.render 
                    ? column.render(item)
                    : item[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}