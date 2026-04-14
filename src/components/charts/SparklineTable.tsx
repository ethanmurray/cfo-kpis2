import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface SparklineData {
  value: number
}

interface SparklineTableProps {
  data: any[]
  columns: {
    header: string
    accessor: string
    sparkline?: boolean
    format?: (value: any, row: any) => string
  }[]
}

export default function SparklineTable({ data, columns }: SparklineTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((col, colIndex) => {
                const value = row[col.accessor]

                if (col.sparkline && Array.isArray(value)) {
                  // Render sparkline
                  const sparklineData = value.map(v => ({ value: v }))
                  const min = Math.min(...value)
                  const max = Math.max(...value)
                  const last = value[value.length - 1]
                  const isPositive = value[value.length - 1] >= value[0]

                  return (
                    <td key={colIndex} className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-8">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sparklineData}>
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke={isPositive ? '#10b981' : '#ef4444'}
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="text-xs text-gray-500">
                          {last.toFixed(0)}
                        </div>
                      </div>
                    </td>
                  )
                }

                return (
                  <td
                    key={colIndex}
                    className="px-4 py-3 text-sm text-gray-900"
                  >
                    {col.format ? col.format(value, row) : value}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
