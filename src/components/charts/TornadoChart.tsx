import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'

interface TornadoDataPoint {
  parameter: string
  low: number
  high: number
  impact: number
}

interface TornadoChartProps {
  data: TornadoDataPoint[]
  baseCase: number
  height?: number
  valueFormatter?: (value: number) => string
}

export default function TornadoChart({
  data,
  baseCase,
  height = 400,
  valueFormatter = (v) => v.toFixed(0)
}: TornadoChartProps) {
  // Sort by absolute impact (largest to smallest)
  const sortedData = [...data].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))

  // Transform data for tornado visualization
  const transformedData = sortedData.map(item => {
    const lowDelta = item.low - baseCase
    const highDelta = item.high - baseCase

    return {
      parameter: item.parameter,
      lowBar: Math.min(lowDelta, 0),
      highBar: Math.max(highDelta, 0),
      lowValue: item.low,
      highValue: item.high,
      impact: item.impact
    }
  })

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={transformedData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          type="number"
          tickFormatter={valueFormatter}
          tick={{ fontSize: 11 }}
          label={{
            value: 'Impact from Base Case',
            position: 'bottom',
            offset: 0,
            style: { fontSize: 12, fill: '#6b7280' }
          }}
        />
        <YAxis
          type="category"
          dataKey="parameter"
          width={140}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          content={<CustomTooltip valueFormatter={valueFormatter} baseCase={baseCase} />}
          cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
        />
        <ReferenceLine x={0} stroke="#374151" strokeWidth={2} />

        {/* Low side (negative impact) */}
        <Bar dataKey="lowBar" stackId="a" fill="#ef4444">
          {transformedData.map((entry, index) => (
            <Cell key={`low-${index}`} />
          ))}
        </Bar>

        {/* High side (positive impact) */}
        <Bar dataKey="highBar" stackId="a" fill="#10b981">
          {transformedData.map((entry, index) => (
            <Cell key={`high-${index}`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  valueFormatter,
  baseCase
}: {
  active?: boolean
  payload?: any[]
  valueFormatter: (value: number) => string
  baseCase: number
}) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-900 mb-2">{data.parameter}</p>
      <div className="space-y-1 text-sm">
        <p className="text-gray-600">
          Base Case: <span className="font-medium text-gray-900">{valueFormatter(baseCase)}</span>
        </p>
        <p className="text-red-600">
          Low Scenario: <span className="font-medium">{valueFormatter(data.lowValue)}</span>
          <span className="text-xs ml-1">({valueFormatter(data.lowBar)})</span>
        </p>
        <p className="text-green-600">
          High Scenario: <span className="font-medium">{valueFormatter(data.highValue)}</span>
          <span className="text-xs ml-1">({valueFormatter(data.highBar)})</span>
        </p>
        <p className="text-gray-600 pt-2 border-t border-gray-200">
          Total Range: <span className="font-medium text-gray-900">{valueFormatter(Math.abs(data.impact))}</span>
        </p>
      </div>
    </div>
  )
}
