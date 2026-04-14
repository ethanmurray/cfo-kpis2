import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer, ReferenceLine } from 'recharts'
import { formatCurrency } from '../../utils/dataGenerators'

interface WaterfallDataPoint {
  name: string
  value: number
  isTotal?: boolean
}

interface WaterfallChartProps {
  data: WaterfallDataPoint[]
  height?: number
  valueFormatter?: (value: number) => string
  title?: string
}

export default function WaterfallChart({
  data,
  height = 400,
  valueFormatter = (v) => formatCurrency(v, 1),
  title
}: WaterfallChartProps) {
  // Transform data for waterfall visualization
  const transformedData = data.map((item, index) => {
    let cumulativeSum = 0

    // Calculate cumulative sum up to this point
    for (let i = 0; i < index; i++) {
      if (!data[i].isTotal) {
        cumulativeSum += data[i].value
      }
    }

    const startValue = index === 0 ? 0 : cumulativeSum
    const endValue = item.isTotal ? item.value : startValue + item.value

    return {
      name: item.name,
      start: item.isTotal ? 0 : startValue,
      value: item.isTotal ? item.value : Math.abs(item.value),
      end: endValue,
      isTotal: item.isTotal || false,
      isPositive: item.value >= 0,
      actualValue: item.value
    }
  })

  const getBarColor = (item: typeof transformedData[0]) => {
    if (item.isTotal) return '#3b82f6' // blue for totals
    return item.isPositive ? '#10b981' : '#ef4444' // green for positive, red for negative
  }

  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={transformedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={valueFormatter}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            content={<CustomTooltip valueFormatter={valueFormatter} />}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <ReferenceLine y={0} stroke="#6b7280" strokeWidth={2} />

          {/* Invisible bars for start position */}
          <Bar dataKey="start" stackId="a" fill="transparent" />

          {/* Visible bars for the change */}
          <Bar dataKey="value" stackId="a">
            {transformedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function CustomTooltip({
  active,
  payload,
  valueFormatter
}: {
  active?: boolean
  payload?: any[]
  valueFormatter: (value: number) => string
}) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
      <div className="space-y-1 text-sm">
        {!data.isTotal && (
          <>
            <p className="text-gray-600">
              Change:{' '}
              <span className={`font-medium ${data.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {data.isPositive ? '+' : ''}{valueFormatter(data.actualValue)}
              </span>
            </p>
            <p className="text-gray-600">
              Cumulative: <span className="font-medium text-gray-900">{valueFormatter(data.end)}</span>
            </p>
          </>
        )}
        {data.isTotal && (
          <p className="text-gray-600">
            Total: <span className="font-medium text-blue-600">{valueFormatter(data.actualValue)}</span>
          </p>
        )}
      </div>
    </div>
  )
}
